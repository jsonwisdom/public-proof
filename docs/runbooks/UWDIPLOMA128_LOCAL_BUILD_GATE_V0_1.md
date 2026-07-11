# UWDiploma128 Local Build Gate v0.1

**Posture:** local-only, no deployment, no signer, authority=false.

## Current observed boundary

Repository code search did not surface a complete `UWDiploma128.sol` implementation. The repository contains a validation patch surface, but a patch is not a deployable contract.

Therefore:

- `CONTRACT_SOURCE_PRESENT = UNOBSERVED`
- `COMPILE_RESULT = NOT_RUN`
- `TEST_RESULT = NOT_RUN`
- `ABI_HASH = UNAVAILABLE`
- `BYTECODE_HASH = UNAVAILABLE`
- `DEPLOYMENT = BLOCKED`
- `AUTHORITY = FALSE`

This gate forbids creating a synthetic contract around guessed function signatures merely to obtain a green test.

## Required full source surface before compile

A complete `contracts/UWDiploma128.sol` must define and reconcile at least:

- constructor and admin role assignment
- `REGISTRAR_ROLE`
- `ORACLE_ROLE`
- receipt storage and receipt ID derivation
- `registerReceipt(...)`
- `receiptValidated(bytes32)`
- `validateReceipt(bytes32)`
- diploma mint function and mint authorization
- double-mint invariant
- anti-self-deal invariant
- receipt existence invariant
- events needed to recover the canonical `receiptId`

Exact names and arguments must come from the actual source, not from assumptions in a test template.

## Preferred toolchain

Foundry is already observed installed in the operator environment. Once the complete contract exists, prefer:

```bash
forge init --force
forge install OpenZeppelin/openzeppelin-contracts --no-commit
forge build
forge test -vvv
```

Do not initialize over existing project files without first reviewing the resulting diff.

## Minimum deterministic test matrix

1. Admin can grant registrar and oracle roles.
2. Unauthorized account cannot register a receipt.
3. Registrar can register one receipt and the emitted event exposes the canonical receipt ID.
4. Student cannot self-validate.
5. Unauthorized account cannot validate.
6. Oracle can validate an existing receipt.
7. Missing receipt validation reverts.
8. Re-validation reverts.
9. Mint before validation reverts.
10. Mint after validation succeeds once.
11. Double mint reverts.
12. Receipt/student mismatch or self-deal path reverts.

## Promotion rule

Only after a real local run emits successful compile and test output may the state advance to:

```text
LOCAL_COMPILE = OBSERVED_PASS
LOCAL_TESTS = OBSERVED_PASS
ABI_HASH = OBSERVED
BYTECODE_HASH = OBSERVED
```

Until then, deployment and role-grant vectors remain blocked.
