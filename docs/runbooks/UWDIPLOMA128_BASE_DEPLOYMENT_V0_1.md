# UWDiploma128 Base Deployment Runbook v0.1

**Mode:** review-first, signer-safe, no automatic broadcast  
**Network:** Base mainnet (`chain_id = 8453`)  
**Authority:** false

## Security correction

Do **not** pass a raw private key through `--private-key`, shell history, `.env`, chat, CI logs, or command-line arguments.

Use a Foundry-managed encrypted account or a hardware/managed signer. This runbook assumes an encrypted Foundry keystore account named `uwdiploma-deployer`.

## Preconditions

The following must remain true before any broadcast:

```text
LOCAL_COMPILE = PASS
LOCAL_TESTS = PASS_12_OF_12
ABI_SHA256 = ce6ae9bf7bc81ed2bd55fdf16a2184810efe350bf5a1e6c53c13911c431ffe8f
CREATION_BYTECODE_SHA256 = 16b4ee600f7ac7cb5e7d6c4f17cba8bf744ce1d4acf142d016eef284280496e1
CREATION_BYTECODE_BYTES = 8060
BASE_CHAIN_ID = 8453
BROADCAST_AUTHORIZED_BY_HUMAN = FALSE
```

## 1. Refresh and re-verify the local artifact

```bash
cd ~/public-proof
git pull --ff-only
forge clean
forge build
forge test -vvv
```

Stop if any command fails.

## 2. Confirm Base RPC and chain identity

```bash
: "${BASE_RPC_URL:?BASE_RPC_URL is required}"
CHAIN_ID="$(cast chain-id --rpc-url "$BASE_RPC_URL")"
printf 'CHAIN_ID=%s\n' "$CHAIN_ID"
test "$CHAIN_ID" = "8453"
```

Project selection in Google Cloud is not wallet control and is not deployment authority.

## 3. Create or inspect an encrypted Foundry account

Create once, interactively, without pasting the secret into chat:

```bash
cast wallet import uwdiploma-deployer --interactive
```

Inspect only the public address:

```bash
DEPLOYER_ADDRESS="$(cast wallet address --account uwdiploma-deployer)"
printf 'DEPLOYER_ADDRESS=%s\n' "$DEPLOYER_ADDRESS"
cast balance "$DEPLOYER_ADDRESS" --rpc-url "$BASE_RPC_URL"
```

Do not continue if the displayed address is not the intended deployer.

## 4. Non-broadcast transaction preparation

First confirm the locally installed CLI options:

```bash
forge create --help | sed -n '1,220p'
```

Then prepare the deployment without broadcasting:

```bash
forge create \
  --rpc-url "$BASE_RPC_URL" \
  --account uwdiploma-deployer \
  contracts/UWDiploma128.sol:UWDiploma128
```

**Required observation:** the output must not contain a transaction hash or deployed contract address. If the installed Foundry version requires a distinct simulation flag, use only the flag documented by the local `forge create --help` output. Do not add `--broadcast` during this stage.

Capture the preparation output locally:

```bash
mkdir -p receipts/local
forge create \
  --rpc-url "$BASE_RPC_URL" \
  --account uwdiploma-deployer \
  contracts/UWDiploma128.sol:UWDiploma128 \
  2>&1 | tee receipts/local/uwdiploma128_deploy_prepare.txt
```

Do not commit local files if they contain sensitive account metadata.

## 5. Human review gate

Before broadcast, record and review:

- deployer public address
- Base chain ID `8453`
- estimated deployment gas and maximum fee
- source commit SHA
- ABI SHA-256
- creation-bytecode SHA-256
- constructor arguments: none
- initial admin: deployer address by constructor behavior
- intended registrar address
- intended oracle address
- whether admin should later transfer to a multisig

No role grant should be bundled into the deployment transaction.

## 6. Broadcast only after explicit human authorization

The live command must be constructed from the locally displayed `forge create --help` syntax and use the encrypted account. A valid broadcast command will include the installed version's explicit broadcast option and must not include `--private-key`.

Template, subject to local help confirmation:

```bash
forge create \
  --rpc-url "$BASE_RPC_URL" \
  --account uwdiploma-deployer \
  --broadcast \
  contracts/UWDiploma128.sol:UWDiploma128
```

Contract verification is a separate step. Do not combine deployment and verification until the correct Base explorer verifier configuration and API credential handling have been reviewed.

## 7. Post-deployment receipt capture

After a real broadcast, capture only public values:

```bash
export DEPLOY_TX_HASH="0x..."
export DIPLOMA_CONTRACT_ADDRESS="0x..."

cast receipt "$DEPLOY_TX_HASH" --rpc-url "$BASE_RPC_URL" --json \
  > receipts/local/uwdiploma128_deployment_receipt.json

cast code "$DIPLOMA_CONTRACT_ADDRESS" --rpc-url "$BASE_RPC_URL" \
  > receipts/local/uwdiploma128_runtime_bytecode.hex

python3 - <<'PY'
import hashlib
from pathlib import Path

p = Path("receipts/local/uwdiploma128_runtime_bytecode.hex")
h = p.read_text().strip()
if h.startswith("0x"):
    h = h[2:]
if not h:
    raise SystemExit("ERROR: deployed runtime bytecode is empty")
b = bytes.fromhex(h)
print("RUNTIME_BYTECODE_SHA256=" + hashlib.sha256(b).hexdigest())
print("RUNTIME_BYTECODE_BYTES=" + str(len(b)))
PY
```

Also verify:

```bash
cast chain-id --rpc-url "$BASE_RPC_URL"
cast code "$DIPLOMA_CONTRACT_ADDRESS" --rpc-url "$BASE_RPC_URL"
cast call "$DIPLOMA_CONTRACT_ADDRESS" "supportsInterface(bytes4)(bool)" 0x80ac58cd --rpc-url "$BASE_RPC_URL"
```

## 8. Role grants are a separate governed lane

Do not grant `ORACLE_ROLE` or `REGISTRAR_ROLE` until:

1. deployment receipt is captured,
2. deployed runtime bytecode is observed,
3. runtime behavior is checked,
4. each recipient address is independently reviewed,
5. role-grant transactions are separately authorized and receipted.

A bridge signer address must never be inferred from a schema creator, project selection, wallet association, or environment variable alone.

## State membrane

```text
DEPLOYMENT_RUNBOOK = PRESENT
DRY_PREPARATION = NOT_EXECUTED
BROADCAST = NOT_AUTHORIZED
DEPLOYMENT_TX = UNOBSERVED
CONTRACT_ADDRESS = UNOBSERVED
RUNTIME_BYTECODE_HASH = UNOBSERVED
ORACLE_ROLE_GRANT = BLOCKED
REGISTRAR_ROLE_GRANT = BLOCKED
LIVE_BRIDGE = NOT_STARTED
AUTHORITY = FALSE
NO_FAKE_GREEN = TRUE
```
