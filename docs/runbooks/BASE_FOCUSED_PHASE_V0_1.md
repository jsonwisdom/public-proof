# Base-Focused Phase v0.1

## Purpose

This runbook declares Base as the active execution focus while the Google Cloud identity lane remains deferred.

The cloud lane is preserved as independent evidence. Its current inability to provide a stable mobile execution surface does not block Base preparation.

## Current Base posture

```text
NETWORK = BASE_MAINNET
CHAIN_ID = 8453
CONTRACT = UWDiploma128
CI_GATE = GREEN
CI_TWO_BUILD_EXACT_MATCH = TRUE
CI_TESTS = PASS_12_OF_12
LOCAL_CI_HARDENED_MATCH = TRUE
UNSIGNED_DEPLOYMENT_BUNDLE_V0_2 = READY
PUBLIC_DEPLOYER_ADDRESS = UNSET
SIGNING_METHOD = UNSET
WALLET_CONTROL = UNPROVEN
TRANSACTION_SIMULATION = UNOBSERVED
BROADCAST = NOT_AUTHORIZED
DEPLOYMENT_TX = UNOBSERVED
CONTRACT_ADDRESS = UNOBSERVED
RUNTIME_BYTECODE_HASH_ON_CHAIN = UNOBSERVED
ORACLE_ROLE_GRANT = BLOCKED
REGISTRAR_ROLE_GRANT = BLOCKED
LIVE_BRIDGE = NOT_STARTED
AUTHORITY = FALSE
NO_FAKE_GREEN = TRUE
NO_FAKE_RED = TRUE
```

## Canonical artifact boundary

```text
ABI_SHA256 = ce6ae9bf7bc81ed2bd55fdf16a2184810efe350bf5a1e6c53c13911c431ffe8f
CREATION_BYTECODE_SHA256 = 27f852a32bb9298e2465d4978aa8112fd0a5b547b2799f10e66ee538d329293a
CREATION_BYTECODE_BYTES = 8006
RUNTIME_BYTECODE_SHA256 = e6cf0e0645277f95d1db858bbe39d187f24228d5e6ee046d215fd0294f05225a
RUNTIME_BYTECODE_BYTES = 7292
```

These values are the only admissible contract artifact baseline for deployment preparation.

## Active phase

```text
BASE_PREDEPLOYMENT_REVIEW = DECLARED
BASE_DEPLOYMENT = NOT_DECLARED
BASE_BRIDGE = NOT_DECLARED
GOOGLE_CLOUD_LANE = DEFERRED_INDEPENDENT
```

The active phase is review and simulation preparation only.

## Required next inputs

1. Public deployer or Safe address.
2. Signing method chosen from the signer-boundary runbook.
3. Public Base RPC read confirming chain ID 8453.
4. Nonce, balance, gas estimate, and fee estimate for the public deployer.
5. Transaction simulation or signer-side review packet.
6. Separate explicit authorization before any signing or broadcast.

## Approved signing methods

- Safe or multisig interface.
- Hardware wallet on a stable machine.
- Managed signer with explicit policy and audit surface.

## Prohibited actions

- Do not request, paste, store, or transmit private keys, seed phrases, recovery phrases, wallet exports, PINs, passwords, session tokens, or signing secrets.
- Do not use an address alone as proof of wallet control.
- Do not claim deployment from an unsigned bundle.
- Do not grant `ORACLE_ROLE` or `REGISTRAR_ROLE` before independently replaying the deployment transaction and verifying deployed runtime bytecode.
- Do not start the live bridge before contract address, runtime hash, role grants, and signer identity are independently observed.

## Promotion ladder

```text
PUBLIC_DEPLOYER_DECLARED
    ↓
SIGNING_METHOD_DECLARED
    ↓
CHAIN_ID_8453_OBSERVED
    ↓
NONCE_BALANCE_GAS_FEES_OBSERVED
    ↓
TRANSACTION_SIMULATION_OBSERVED
    ↓
EXPLICIT_BROADCAST_AUTHORIZATION
    ↓
DEPLOYMENT_TRANSACTION_BROADCAST
    ↓
RECEIPT_STATUS_SUCCESS_OBSERVED
    ↓
CONTRACT_ADDRESS_OBSERVED
    ↓
RUNTIME_BYTECODE_HASH_MATCHED
    ↓
ROLE_GRANTS_REVIEWED
    ↓
BRIDGE_START_REVIEWED
```

No rung may be inferred from the next rung.

## Cloud lane boundary

The latest cloud receipt remains part of the 50/50 manifest, but:

```text
ACTIVE_GCLOUD_IDENTITY = ABSENT
GOOGLE_PROJECT_CONTROL = UNPROVEN
CLOUD_DEPLOYMENT_AUTHORITY = FALSE
```

This does not create a red condition for Base. It only keeps the Google Cloud lane unresolved.

## Final state

```text
BASE_FOCUS = ACTIVE
BASE_PREDEPLOYMENT_REVIEW = OPEN
DEPLOYMENT_AUTHORITY = FALSE
BROADCAST_AUTHORITY = FALSE
AUTHORITY = FALSE
```
