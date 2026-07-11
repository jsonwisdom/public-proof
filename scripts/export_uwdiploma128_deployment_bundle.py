#!/usr/bin/env python3
"""Export a signer-free Base deployment bundle for UWDiploma128.

Reads the local Foundry artifact and emits only public unsigned transaction data.
No key, keystore, RPC call, signature, or broadcast is performed.
"""

from __future__ import annotations

import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

ARTIFACT = Path("out/UWDiploma128.sol/UWDiploma128.json")
OUTPUT = Path("receipts/local/uwdiploma128_unsigned_deployment_bundle.json")
EXPECTED_ABI_SHA256 = "ce6ae9bf7bc81ed2bd55fdf16a2184810efe350bf5a1e6c53c13911c431ffe8f"
EXPECTED_CREATION_SHA256 = "16b4ee600f7ac7cb5e7d6c4f17cba8bf744ce1d4acf142d016eef284280496e1"
EXPECTED_CREATION_BYTES = 8060


def fail(message: str) -> None:
    raise SystemExit(f"ERROR: {message}")


def main() -> None:
    if not ARTIFACT.exists():
        fail(f"missing Foundry artifact: {ARTIFACT}")

    data = json.loads(ARTIFACT.read_text())
    abi = data.get("abi")
    bytecode_hex = data.get("bytecode", {}).get("object", "")

    if abi is None:
        fail("artifact ABI is missing")

    if bytecode_hex.startswith("0x"):
        bytecode_hex = bytecode_hex[2:]

    if not bytecode_hex:
        fail("creation bytecode is empty")

    try:
        bytecode = bytes.fromhex(bytecode_hex)
    except ValueError as exc:
        fail(f"creation bytecode is not valid hex: {exc}")

    abi_json = json.dumps(abi, separators=(",", ":"), ensure_ascii=False)
    abi_sha256 = hashlib.sha256(abi_json.encode()).hexdigest()
    creation_sha256 = hashlib.sha256(bytecode).hexdigest()
    creation_bytes = len(bytecode)

    if abi_sha256 != EXPECTED_ABI_SHA256:
        fail(f"ABI hash mismatch: {abi_sha256}")
    if creation_sha256 != EXPECTED_CREATION_SHA256:
        fail(f"creation bytecode hash mismatch: {creation_sha256}")
    if creation_bytes != EXPECTED_CREATION_BYTES:
        fail(f"creation bytecode length mismatch: {creation_bytes}")

    bundle = {
        "artifact_type": "UWDIPLOMA128_UNSIGNED_DEPLOYMENT_BUNDLE",
        "version": "0.1",
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "network": {
            "name": "Base Mainnet",
            "chain_id": 8453,
        },
        "contract": {
            "name": "UWDiploma128",
            "source": "contracts/UWDiploma128.sol",
            "constructor_arguments": [],
            "abi_sha256": abi_sha256,
            "creation_bytecode_sha256": creation_sha256,
            "creation_bytecode_bytes": creation_bytes,
        },
        "unsigned_transaction": {
            "chainId": "0x2105",
            "to": None,
            "value": "0x0",
            "data": "0x" + bytecode_hex,
        },
        "required_human_inputs": {
            "from": "UNSET",
            "gas": "UNSET",
            "maxFeePerGas": "UNSET",
            "maxPriorityFeePerGas": "UNSET",
            "nonce": "UNSET",
        },
        "security_boundary": {
            "private_key_present": False,
            "signature_present": False,
            "rpc_call_performed": False,
            "broadcast_performed": False,
            "deployment_claimed": False,
            "authority": False,
        },
    }

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(bundle, indent=2) + "\n")

    print(f"BUNDLE_PATH={OUTPUT}")
    print(f"ABI_SHA256={abi_sha256}")
    print(f"CREATION_BYTECODE_SHA256={creation_sha256}")
    print(f"CREATION_BYTECODE_BYTES={creation_bytes}")
    print("UNSIGNED_DEPLOYMENT_BUNDLE=READY")
    print("BROADCAST=NOT_PERFORMED")
    print("AUTHORITY=FALSE")


if __name__ == "__main__":
    main()
