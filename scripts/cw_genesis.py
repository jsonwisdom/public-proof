"""CW Genesis v0.1: deterministic inclusion proofs and off-chain EIP-712 EOA verification.
Not a zero-knowledge prover, identity oracle, or production signing service.
"""
import hashlib
import json

LEAF_TAG = b"CW-GENESIS-LEAF-v0.1\x00"
NODE_TAG = b"CW-GENESIS-NODE-v0.1\x00"
PURPOSE = "CW_GENESIS_RELEASE_AUTHORIZATION"
DOMAIN = {"name": "Computer Wisdom Genesis", "version": "1", "chainId": 8453}
FIELDS = [
    {"name": "manifestRoot", "type": "bytes32"},
    {"name": "schema", "type": "string"},
    {"name": "releaseId", "type": "bytes32"},
    {"name": "nonce", "type": "uint256"},
    {"name": "timestamp", "type": "uint256"},
    {"name": "expiresAt", "type": "uint256"},
    {"name": "evidenceStatus", "type": "string"},
    {"name": "purpose", "type": "string"},
]

def canonical(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"),
                      ensure_ascii=False, allow_nan=False).encode("utf-8")

def digest(value):
    return hashlib.sha256(value).digest()

def leaf(record):
    return digest(LEAF_TAG + canonical(record))

def parent(left, right):
    if len(left) != 32 or len(right) != 32:
        raise ValueError("Each child must be 32 bytes")
    return digest(NODE_TAG + left + right)

def tree(records):
    if not records:
        raise ValueError("Empty tree prohibited")
    # Caller must supply stable, unique identifiers.
    ids = [r["id"] for r in records]
    if any(not isinstance(i, str) or not i for i in ids) or len(ids) != len(set(ids)):
        raise ValueError("Leaf IDs must be unique nonempty strings")
    ordered = sorted(records, key=lambda r: r["id"])
    levels = [[leaf(r) for r in ordered]]
    while len(levels[-1]) > 1:
        layer = levels[-1]
        if len(layer) % 2:
            layer = layer + [layer[-1]]
        levels.append([parent(layer[i], layer[i + 1]) for i in range(0, len(layer), 2)])
    return ordered, levels

def prove(records, identifier):
    ordered, levels = tree(records)
    ids = [r["id"] for r in ordered]
    if identifier not in ids:
        raise KeyError(identifier)
    idx = ids.index(identifier)
    siblings = []
    for layer in levels[:-1]:
        neighbor = idx ^ 1
        if neighbor >= len(layer):
            neighbor = idx
        siblings.append({"side": "left" if idx % 2 else "right",
                         "hash": layer[neighbor].hex()})
        idx //= 2
    return {"schema": "cw-inclusion-v0.1", "leafId": identifier,
            "leafHash": leaf(ordered[ids.index(identifier)]).hex(),
            "root": levels[-1][0].hex(), "siblings": siblings}

def verify(record, proof, trusted_root):
    try:
        if proof["schema"] != "cw-inclusion-v0.1" or record["id"] != proof["leafId"]:
            return False
        if len(proof["siblings"]) > 64 or len(bytes.fromhex(trusted_root)) != 32:
            return False
        acc = leaf(record)
        if acc.hex() != proof["leafHash"]:
            return False
        for s in proof["siblings"]:
            other = bytes.fromhex(s["hash"])
            if len(other) != 32:
                return False
            if s["side"] == "left":
                acc = parent(other, acc)
            elif s["side"] == "right":
                acc = parent(acc, other)
            else:
                return False
        return acc.hex() == trusted_root == proof["root"]
    except (KeyError, ValueError, TypeError, AttributeError):
        return False

def typed_authorization(root, release_id, nonce, timestamp, expires_at, status="HOLD"):
    if any(not isinstance(x, int) or isinstance(x, bool) or x < 0 or x >= 2**256
           for x in (nonce, timestamp, expires_at)):
        raise ValueError("Invalid uint256")
    if not timestamp < expires_at:
        raise ValueError("Expiry must follow timestamp")
    for h in (root, release_id):
        if not isinstance(h, str) or not h.startswith("0x") or len(h) != 66:
            raise ValueError("bytes32 must be 0x-prefixed")
        bytes.fromhex(h[2:])
    if status not in ("HOLD", "UNKNOWN", "FAIL"):
        raise ValueError("Unreviewed manifest cannot claim PASS")
    return {"types": {"EIP712Domain": [
                {"name": "name", "type": "string"},
                {"name": "version", "type": "string"},
                {"name": "chainId", "type": "uint256"}],
                "GenesisAuthorization": FIELDS},
            "primaryType": "GenesisAuthorization", "domain": DOMAIN.copy(),
            "message": {"manifestRoot": root, "schema": "cw-genesis-v0.1",
                        "releaseId": release_id, "nonce": nonce,
                        "timestamp": timestamp, "expiresAt": expires_at,
                        "evidenceStatus": status, "purpose": PURPOSE}}

def verify_eoa(signature, payload, expected_address, now, *, consumed_nonces=()):
    """EOA signature only. Caller persists/reconciles nonce registry externally.
    EIP-1271 smart-contract wallets MUST be handled by a separate chain-aware verifier.
    """
    try:
        from eth_account import Account
        from eth_account.messages import encode_typed_data
        if payload["domain"] != DOMAIN or payload["primaryType"] != "GenesisAuthorization":
            return False
        msg = payload["message"]
        if payload["types"]["GenesisAuthorization"] != FIELDS:
            return False
        if payload["types"]["EIP712Domain"] != typed_authorization(
                "0x" + "00"*32, "0x" + "00"*32, 0, 1, 2)["types"]["EIP712Domain"]:
            return False
        if (msg["schema"] != "cw-genesis-v0.1" or msg["purpose"] != PURPOSE or
                msg["evidenceStatus"] not in ("HOLD", "UNKNOWN", "FAIL") or
                type(msg["timestamp"]) is not int or type(msg["expiresAt"]) is not int or
                type(msg["nonce"]) is not int or
                not (0 <= msg["timestamp"] <= now < msg["expiresAt"]) or
                not (0 <= msg["nonce"] < 2**256) or msg["nonce"] in consumed_nonces):
            return False
        for key in ("manifestRoot", "releaseId"):
            h = msg[key]
            if not isinstance(h, str) or len(h) != 66 or not h.startswith("0x"):
                return False
            if len(bytes.fromhex(h[2:])) != 32:
                return False
        signed = encode_typed_data(full_message=payload)
        recovered = Account.recover_message(signed, signature=signature)
        return recovered.lower() == expected_address.lower()
    except (KeyError, ValueError, TypeError, AttributeError, ImportError):
        return False
