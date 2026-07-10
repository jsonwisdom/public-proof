#!/usr/bin/env bash
set -euo pipefail

EXPECTED_ADDRESS="0xa380552a27b0a5a2874ea7aa52cac09f542002e8"
RPC_URL="${BASE_RPC_URL:-https://mainnet.base.org}"
SIG="${1:-${SIG:-}}"
RUN_ID="$(date -u +%Y%m%dT%H%M%SZ)"
OUT_DIR="receipts/wallet-verification-${RUN_ID}"
mkdir -p "$OUT_DIR"

if [[ ! "$SIG" =~ ^0x[0-9a-fA-F]+$ ]]; then
  echo "ERROR: provide a full 0x-prefixed signature as argument 1 or SIG env var" >&2
  exit 2
fi

if (( (${#SIG} - 2) % 2 != 0 )); then
  echo "ERROR: signature hex length must be even" >&2
  exit 2
fi

printf '%s\n' "$SIG" > "$OUT_DIR/wallet_signature_v0_1.hex"

curl -fsS -X POST \
  -H 'Content-Type: application/json' \
  --data "{\"jsonrpc\":\"2.0\",\"method\":\"eth_getCode\",\"params\":[\"${EXPECTED_ADDRESS}\",\"latest\"],\"id\":1}" \
  "$RPC_URL" > "$OUT_DIR/account_type_probe.json"

curl -fsS -X POST \
  -H 'Content-Type: application/json' \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":2}' \
  "$RPC_URL" > "$OUT_DIR/block_number_probe.json"

python3 - "$OUT_DIR" "$EXPECTED_ADDRESS" <<'PY'
import json
import pathlib
import sys

out = pathlib.Path(sys.argv[1])
address = sys.argv[2]

probe = json.loads((out / "account_type_probe.json").read_text())
block = json.loads((out / "block_number_probe.json").read_text())

if "error" in probe:
    account_type = "INDETERMINATE"
    code = None
    probe_status = "RPC_ERROR"
else:
    code = probe.get("result")
    probe_status = "OBSERVED"
    if code == "0x":
        account_type = "EOA_CANDIDATE"
    elif isinstance(code, str) and code.startswith("0x") and len(code) > 2:
        account_type = "SMART_ACCOUNT_CANDIDATE"
    else:
        account_type = "INDETERMINATE"

receipt = {
    "artifact_type": "BASE_ACCOUNT_TYPE_PROBE_RECEIPT",
    "version": "0.1",
    "address": address,
    "rpc_endpoint": "https://mainnet.base.org",
    "block_number_hex": block.get("result"),
    "code": code,
    "probe_status": probe_status,
    "account_type": account_type,
    "wallet_signature_present": True,
    "wallet_signature_verified": False,
    "next_verification_path": (
        "EOA_RECOVERY_REQUIRED" if account_type == "EOA_CANDIDATE"
        else "ERC1271_OR_ACCOUNT_SPECIFIC_VALIDATION_REQUIRED" if account_type == "SMART_ACCOUNT_CANDIDATE"
        else "RETRY_OR_ALTERNATE_RPC_REQUIRED"
    ),
    "wallet_control": "UNPROVEN",
    "authority": False,
    "no_fake_green": True,
    "no_fake_red": True,
}
(out / "account_type_receipt.json").write_text(json.dumps(receipt, indent=2) + "\n")
PY

(
  cd "$OUT_DIR"
  sha256sum wallet_signature_v0_1.hex account_type_probe.json block_number_probe.json account_type_receipt.json \
    > manifest.sha256
  sha256sum manifest.sha256 > manifest.sha256.sha256
)

echo "Created bounded verification intake at: $OUT_DIR"
echo "No wallet-control promotion was performed."
echo "Next step depends on account_type_receipt.json."
