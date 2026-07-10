#!/usr/bin/env bash
set -euo pipefail

: "${BASE_RPC_URL:?BASE_RPC_URL is required}"
: "${SCHEMA_REGISTRY_ADDRESS:?SCHEMA_REGISTRY_ADDRESS is required}"

SCHEMA='bytes32 receiptId,address studentWallet,uint8 action,bytes32 evidenceHash'
RESOLVER='0x0000000000000000000000000000000000000000'
REVOCABLE='true'
MODE="${1:-dry-run}"

if ! command -v cast >/dev/null 2>&1; then
  echo "ERROR: cast is required" >&2
  exit 1
fi

if [[ ! "$SCHEMA_REGISTRY_ADDRESS" =~ ^0x[0-9a-fA-F]{40}$ ]]; then
  echo "ERROR: SCHEMA_REGISTRY_ADDRESS must be a full 20-byte address" >&2
  exit 1
fi

CHAIN_ID="$(cast chain-id --rpc-url "$BASE_RPC_URL")"
if [ "$CHAIN_ID" != "8453" ]; then
  echo "ERROR: expected Base mainnet chain ID 8453, got $CHAIN_ID" >&2
  exit 1
fi

UID="$(cast call \
  --rpc-url "$BASE_RPC_URL" \
  "$SCHEMA_REGISTRY_ADDRESS" \
  'getSchemaUID(string,address,bool)(bytes32)' \
  "$SCHEMA" \
  "$RESOLVER" \
  "$REVOCABLE")"

echo "CHAIN_ID=$CHAIN_ID"
echo "SCHEMA_REGISTRY_ADDRESS=$SCHEMA_REGISTRY_ADDRESS"
echo "SCHEMA=$SCHEMA"
echo "RESOLVER=$RESOLVER"
echo "REVOCABLE=$REVOCABLE"
echo "EXPECTED_SCHEMA_UID=$UID"

if [ "$MODE" = "dry-run" ]; then
  echo "DRY_RUN_ONLY=TRUE"
  echo "No transaction sent."
  exit 0
fi

if [ "$MODE" != "send" ]; then
  echo "ERROR: mode must be 'dry-run' or 'send'" >&2
  exit 1
fi

: "${DEPLOYER_ACCOUNT:?DEPLOYER_ACCOUNT is required in send mode}"

# Uses a Foundry-managed account/keystore. Do not pass a raw private key on the command line.
cast send \
  --rpc-url "$BASE_RPC_URL" \
  --account "$DEPLOYER_ACCOUNT" \
  "$SCHEMA_REGISTRY_ADDRESS" \
  'register(string,address,bool)(bytes32)' \
  "$SCHEMA" \
  "$RESOLVER" \
  "$REVOCABLE"

echo "TRANSACTION_SUBMITTED=TRUE"
echo "EXPECTED_SCHEMA_UID=$UID"
