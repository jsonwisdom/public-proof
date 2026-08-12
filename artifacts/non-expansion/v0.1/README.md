# Non-Expansion Operator v0.1

**Status:** Frozen contract (operator-attested)

## Artifacts

| File | Role |
|------|------|
| `NON_EXPANSION_RESULT_SCHEMA_v0.1.json` | Strict JSON Schema for the result contract |
| `NON_EXPANSION_CANONICAL_TEST_VECTORS_v0.1.json` | 15 canonical test vectors |
| `REFERENCE_NON_EXPANSION_EVALUATOR_v0.1.py` | Reference evaluator (stdlib only) |

## Schema digest (operator-attested)

```
sha256:96050a0a3c0b081601c4667f65a18ddf4e4e5b006ab020a1876c64cf72dd4710
```

Independent re-hash of the schema bytes is required before treating the digest as externally verified.

## Governing rule

`ABSENCE OF PROVEN EXPANSION ≠ PROOF OF NON-EXPANSION`

## Evaluator outcomes

- `EVALUATOR_PASS` = evaluation completed correctly (does **not** imply publication)
- `publication_eligible` = authority to proceed beyond verification
- `R15_VERIFICATION_INDETERMINATE` forces `UNRESOLVED` + non-eligible

## Conformance

```bash
python3 REFERENCE_NON_EXPANSION_EVALUATOR_v0.1.py NON_EXPANSION_CANONICAL_TEST_VECTORS_v0.1.json
```

Expected: 15/15 PASS under the locked interpretation.

## Publication path

Branch: `artifact/non-expansion-operator-v0.1`  
Target: `jsonwisdom/public-proof`  
Path: `artifacts/non-expansion/v0.1/`
