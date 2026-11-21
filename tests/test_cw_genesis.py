"""Synthetic-only regression tests. No user's wallet or private keys."""
import copy
import unittest
from scripts.cw_genesis import (canonical, tree, prove, verify, typed_authorization,
                                verify_eoa, PURPOSE)

RECORDS = [
    {"id": "US/MN/COUNTY/COMMUNITY-A", "purpose": "audit", "status": "HOLD"},
    {"id": "US/MN/COUNTY/COMMUNITY-B", "purpose": "emergency", "status": "UNKNOWN"},
    {"id": "US/NY/COUNTY/COMMUNITY-C", "purpose": "audit", "status": "HOLD"},
]

class MerkleTests(unittest.TestCase):
    def test_order_independent_and_proof_for_all(self):
        records, levels = tree(RECORDS)
        root = levels[-1][0].hex()
        self.assertEqual(tree(list(reversed(RECORDS)))[1][-1][0].hex(), root)
        for record in records:
            self.assertTrue(verify(record, prove(RECORDS, record["id"]), root))

    def test_tamper_missing_and_jurisdiction(self):
        root = tree(RECORDS)[1][-1][0].hex()
        proof = prove(RECORDS, RECORDS[0]["id"])
        tampered = {**RECORDS[0], "status": "PASS"}
        self.assertFalse(verify(tampered, proof, root))
        self.assertFalse(verify({**RECORDS[0], "id": "US/NY/COUNTY/COMMUNITY-A"}, proof, root))
        self.assertFalse(verify(RECORDS[0], {**proof, "root": "0"*64}, root))
        with self.assertRaises(KeyError):
            prove(RECORDS, "missing")
        with self.assertRaises(ValueError):
            tree(RECORDS + [RECORDS[0]])

    def test_canonicalization(self):
        self.assertEqual(canonical({"z": 1, "a": 2}), b'{"a":2,"z":1}')

class TypedAuthorizationTests(unittest.TestCase):
    def setUp(self):
        from eth_account import Account
        from eth_account.messages import encode_typed_data
        self.Account = Account
        self.encode_typed_data = encode_typed_data
        # Known-public, synthetic test-only key; NEVER for actual assets.
        self.key = bytes.fromhex("00"*31 + "01")
        self.expected = Account.from_key(self.key).address
        self.root = "0x" + tree(RECORDS)[1][-1][0].hex()
        self.payload = typed_authorization(self.root, "0x" + "ab"*32,
                                           nonce=12, timestamp=100, expires_at=200)

    def sign(self, payload):
        return self.Account.sign_message(self.encode_typed_data(full_message=payload),
                                         self.key).signature

    def test_signature_and_tamper(self):
        sig = self.sign(self.payload)
        self.assertTrue(verify_eoa(sig, self.payload, self.expected, 150))
        mutated = copy.deepcopy(self.payload)
        mutated["message"]["manifestRoot"] = "0x" + "11"*32
        self.assertFalse(verify_eoa(sig, mutated, self.expected, 150))
        mutated = copy.deepcopy(self.payload)
        mutated["message"]["evidenceStatus"] = "UNKNOWN"
        self.assertFalse(verify_eoa(sig, mutated, self.expected, 150))
        mutated = copy.deepcopy(self.payload)
        mutated["message"]["releaseId"] = "0x" + "cc"*32
        self.assertFalse(verify_eoa(sig, mutated, self.expected, 150))

    def test_expiry_chain_replay_and_wrong_signer(self):
        sig = self.sign(self.payload)
        self.assertFalse(verify_eoa(sig, self.payload, self.expected, 200))
        self.assertFalse(verify_eoa(sig, self.payload, self.expected, 150, consumed_nonces={12}))
        self.assertFalse(verify_eoa(sig, self.payload, "0x" + "00"*20, 150))
        mutated = copy.deepcopy(self.payload)
        mutated["domain"]["chainId"] = 1
        self.assertFalse(verify_eoa(sig, mutated, self.expected, 150))
        mutated = copy.deepcopy(self.payload)
        mutated["message"]["purpose"] = "SPEND"
        self.assertFalse(verify_eoa(sig, mutated, self.expected, 150))

    def test_no_pass_and_explicit_purpose(self):
        self.assertEqual(self.payload["message"]["purpose"], PURPOSE)
        with self.assertRaises(ValueError):
            typed_authorization(self.root, "0x" + "ab"*32, 1, 100, 200, status="PASS")

if __name__ == "__main__":
    unittest.main()
