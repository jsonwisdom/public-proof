# UWDiploma128 Signer Boundary Runbook v0.1

**Network:** Base mainnet (`chain_id = 8453`)  
**Contract:** `UWDiploma128`  
**Authority:** false  
**Broadcast:** not authorized

## Purpose

This runbook defines the remaining boundary between the hardened unsigned deployment bundle and any signed Base transaction.

It does not select a signer, prove wallet control, authorize deployment, or broadcast anything.

## Locked artifact inputs

```text
CI_GATE = GREEN
LOCAL_CI_HARDENED_MATCH = TRUE
UNSIGNED_DEPLOYMENT_BUNDLE_V0_2 = READY
ABI_SHA256 = ce6ae9bf7bc81ed2bd55fdf16a2184810efe350bf5a1e6c53c13911c431ffe8f
CREATION_BYTECODE_SHA256 = 27f852a32bb9298e2465d4978aa8112fd0a5b547b2799f10e66ee538d329293a
CREATION_BYTECODE_BYTES = 8006
EXPECTED_RUNTIME_BYTECODE_SHA256 = e6cf0e0645277f95d1db858bbe39d187f24228d5e6ee046d215fd0294f05225a
EXPECTED_RUNTIME_BYTECODE_BYTES = 7292
```

## Required public declaration

Record only public information:

```text
PUBLIC_DEPLOYER_ADDRESS = 0x...
SIGNING_METHOD = SAFE_UI | HARDWARE_WALLET | MANAGED_SIGNER | OTHER_REVIEWED_METHOD
CHAIN_ID = 8453
BROADCAST_AUTHORIZED = FALSE
```

Never record or transmit:

- private keys
- seed or recovery phrases
- keystore JSON
- passwords or PINs
- raw wallet exports
- authentication cookies or session tokens

A public address declaration is not proof of wallet control.

## Approved signing lanes

### A. Safe UI / multisig

Use when a Safe already exists on Base and its owners and threshold are independently reviewed.

Required review:

```text
SAFE_ADDRESS = 0x...
SAFE_CHAIN_ID = 8453
SAFE_THRESHOLD = observed
SAFE_OWNERS = reviewed separately
TRANSACTION_TO = null / contract creation
TRANSACTION_VALUE = 0
TRANSACTION_DATA_SHA256 = locked creation-bytecode SHA-256
```

The Safe transaction must display the exact contract-creation data from `deployment/uwdiploma128_unsigned_v0_2.json`.

### B. Hardware wallet

Use only from a stable machine and a signer flow supported by the installed tooling. Confirm the public address on the hardware device before signing.

### C. Managed signer

Use only when policy controls, key custody, chain restrictions, spending limits, and audit logs are understood and reviewed.

## About `forge create --from`

A public `--from` address can help prepare or estimate a transaction, but it does not sign and may not be sufficient for every `forge create` simulation mode. The exact installed CLI behavior must be confirmed first:

```bash
forge create --help | sed -n '1,260p'
```

Do not invent or assume a `--dry-run` flag. Use only options shown by the locally installed Foundry version.

## Public RPC preparation lane

This lane performs only public reads and transaction-data inspection:

```bash
cd ~/public-proof || exit 1
export BASE_RPC_URL="${BASE_RPC_URL:-https://mainnet.base.org}"

CHAIN_ID="$(cast chain-id --rpc-url "$BASE_RPC_URL")"
echo "CHAIN_ID=$CHAIN_ID"
test "$CHAIN_ID" = "8453"

jq '{
  network,
  contract,
  unsigned_transaction: {
    chainId,
    from,
    to,
    value,
    nonce,
    gas,
    maxFeePerGas,
    maxPriorityFeePerGas
  },
  security_boundary
}' deployment/uwdiploma128_unsigned_v0_2.json
```

## Pre-broadcast review checklist

The following must be observed before any human signs:

- public deployer or Safe address
- Base chain ID `8453`
- contract creation transaction (`to = null`)
- transaction value `0`
- exact creation bytecode hash
- no constructor arguments
- estimated gas
- fee ceiling acceptable to the signer
- expected initial admin address understood
- role grants excluded from deployment transaction
- post-deploy verification plan ready

## Post-deployment capture plan

After a real transaction exists, capture:

```text
DEPLOYMENT_TX_HASH
CONTRACT_ADDRESS
RECEIPT_STATUS
BLOCK_NUMBER
DEPLOYER_ADDRESS
CHAIN_ID
DEPLOYED_RUNTIME_BYTECODE_SHA256
DEPLOYED_RUNTIME_BYTECODE_BYTES
```

Then independently compare deployed runtime bytecode against:

```text
EXPECTED_RUNTIME_BYTECODE_SHA256 = e6cf0e0645277f95d1db858bbe39d187f24228d5e6ee046d215fd0294f05225a
EXPECTED_RUNTIME_BYTECODE_BYTES = 7292
```

Only after that comparison may role-grant planning begin.

## State membrane

```text
SIGNER_BOUNDARY_RUNBOOK = PRESENT
PUBLIC_DEPLOYER_ADDRESS = UNSET
SIGNING_METHOD = UNSET
WALLET_CONTROL = UNPROVEN
TRANSACTION_SIMULATION = UNOBSERVED
BROADCAST = NOT_AUTHORIZED
DEPLOYMENT_TX = UNOBSERVED
CONTRACT_ADDRESS = UNOBSERVED
ORACLE_ROLE_GRANT = BLOCKED
REGISTRAR_ROLE_GRANT = BLOCKED
LIVE_BRIDGE = NOT_STARTED
AUTHORITY = FALSE
NO_FAKE_GREEN = TRUE
```
