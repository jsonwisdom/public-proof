# UWDiploma128 Base Deployment Runbook v0.2

**Mode:** reconnect-safe, review-first, signer-safe, no automatic broadcast  
**Network:** Base mainnet (`chain_id = 8453`)  
**Authority:** false

## Security correction

Do **not** pass a raw private key through `--private-key`, shell history, `.env`, chat, CI logs, or command-line arguments.

Do **not** run `cast wallet import ... --interactive` from an unstable mobile Cloud Shell session. A dropped session at a secret-entry prompt creates avoidable risk and provides no durable deployment state.

Use a browser wallet, hardware wallet, managed signer, or a stable desktop environment for the signing lane. Cloud Shell remains suitable for public RPC checks, builds, tests, hashes, and non-signing preparation.

## Preconditions

```text
LOCAL_COMPILE = PASS
LOCAL_TESTS = PASS_12_OF_12
ABI_SHA256 = ce6ae9bf7bc81ed2bd55fdf16a2184810efe350bf5a1e6c53c13911c431ffe8f
CREATION_BYTECODE_SHA256 = 16b4ee600f7ac7cb5e7d6c4f17cba8bf744ce1d4acf142d016eef284280496e1
CREATION_BYTECODE_BYTES = 8060
BASE_CHAIN_ID = 8453
BROADCAST_AUTHORIZED_BY_HUMAN = FALSE
```

## 1. One-shot reconnect-safe preflight

Paste this entire block after reconnecting. It performs only public, non-signing checks and writes a resumable local receipt. It does not prompt for secrets and does not broadcast.

```bash
set -u
cd ~/public-proof || exit 1
mkdir -p receipts/local

export BASE_RPC_URL="${BASE_RPC_URL:-https://mainnet.base.org}"
OUT="receipts/local/uwdiploma128_preflight_$(date -u +%Y%m%dT%H%M%SZ).txt"

{
  echo "PRECHECK_STARTED_UTC=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "REPO=$(pwd)"
  echo "GIT_HEAD=$(git rev-parse HEAD)"
  echo "BASE_RPC_URL=$BASE_RPC_URL"

  CHAIN_ID="$(cast chain-id --rpc-url "$BASE_RPC_URL")" || {
    echo "CHAIN_ID_CHECK=FAIL"
    exit 21
  }
  echo "CHAIN_ID=$CHAIN_ID"
  test "$CHAIN_ID" = "8453" || {
    echo "CHAIN_ID_CHECK=FAIL_EXPECTED_8453"
    exit 22
  }
  echo "CHAIN_ID_CHECK=PASS"

  forge build || {
    echo "FORGE_BUILD=FAIL"
    exit 31
  }
  echo "FORGE_BUILD=PASS"

  forge test -q || {
    echo "FORGE_TEST=FAIL"
    exit 32
  }
  echo "FORGE_TEST=PASS"

  python3 - <<'PY'
import hashlib
import json
from pathlib import Path

artifact = Path("out/UWDiploma128.sol/UWDiploma128.json")
data = json.loads(artifact.read_text())
abi_json = json.dumps(data["abi"], separators=(",", ":"), ensure_ascii=False)
bytecode_hex = data["bytecode"]["object"]
if bytecode_hex.startswith("0x"):
    bytecode_hex = bytecode_hex[2:]
if not bytecode_hex:
    raise SystemExit("ERROR: creation bytecode is empty")
bytecode = bytes.fromhex(bytecode_hex)
print("ABI_SHA256=" + hashlib.sha256(abi_json.encode()).hexdigest())
print("CREATION_BYTECODE_SHA256=" + hashlib.sha256(bytecode).hexdigest())
print("CREATION_BYTECODE_BYTES=" + str(len(bytecode)))
PY

  echo "SIGNER_CHECK=SKIPPED_UNSAFE_MOBILE_SESSION"
  echo "DRY_PREPARATION=NOT_EXECUTED"
  echo "BROADCAST=NOT_AUTHORIZED"
  echo "PRECHECK_FINISHED_UTC=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
} 2>&1 | tee "$OUT"

STATUS=${PIPESTATUS[0]}
echo "PRECHECK_EXIT_CODE=$STATUS"
echo "PRECHECK_RECEIPT=$OUT"
exit "$STATUS"
```

A disconnect after the block finishes does not erase the receipt because it is written under `receipts/local/`.

## 2. Resume after reconnect

```bash
cd ~/public-proof
ls -1t receipts/local/uwdiploma128_preflight_*.txt | head -n 1
LATEST="$(ls -1t receipts/local/uwdiploma128_preflight_*.txt | head -n 1)"
cat "$LATEST"
```

Required successful lines:

```text
CHAIN_ID=8453
CHAIN_ID_CHECK=PASS
FORGE_BUILD=PASS
FORGE_TEST=PASS
ABI_SHA256=ce6ae9bf7bc81ed2bd55fdf16a2184810efe350bf5a1e6c53c13911c431ffe8f
CREATION_BYTECODE_SHA256=16b4ee600f7ac7cb5e7d6c4f17cba8bf744ce1d4acf142d016eef284280496e1
CREATION_BYTECODE_BYTES=8060
PRECHECK_EXIT_CODE=0
```

## 3. Signing lane remains separate

Do not attempt signer import in mobile Cloud Shell.

A future signing lane must use one of:

- browser wallet deployment UI that shows the exact contract creation transaction,
- hardware wallet connected to a stable machine,
- managed signer with policy controls,
- encrypted Foundry keystore created and used only in a stable terminal.

Project selection in Google Cloud is not wallet control and is not deployment authority.

## 4. Non-broadcast preparation

The exact preparation syntax must be confirmed from the installed CLI:

```bash
forge create --help | sed -n '1,220p'
```

Do not supply `--private-key`. Do not add `--broadcast`. If the selected signing method cannot safely provide a public deployer address without secret entry, stop.

## 5. Human review gate

Before any broadcast, review:

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

## 6. Post-deployment receipt capture

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

## 7. Role grants are a separate governed lane

Do not grant `ORACLE_ROLE` or `REGISTRAR_ROLE` until:

1. deployment receipt is captured,
2. deployed runtime bytecode is observed,
3. runtime behavior is checked,
4. each recipient address is independently reviewed,
5. role-grant transactions are separately authorized and receipted.

A bridge signer address must never be inferred from a schema creator, project selection, wallet association, or environment variable alone.

## State membrane

```text
DEPLOYMENT_RUNBOOK = RECONNECT_SAFE_V0_2
PUBLIC_PREFLIGHT = READY
INTERACTIVE_SECRET_IMPORT = BLOCKED_ON_MOBILE_CLOUD_SHELL
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
