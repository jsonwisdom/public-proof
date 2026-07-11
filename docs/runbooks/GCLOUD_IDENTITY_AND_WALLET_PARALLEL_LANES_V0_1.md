# Google Identity + Wallet Signature Parallel Lanes v0.1

**Repository:** `jsonwisdom/public-proof`  
**Branch:** `proof-portal-v0`  
**Posture:** `AUTHORITY_FALSE`  
**Boundary:** Google-control and wallet-control remain independent until each lane is separately verified and hash-bound.

## Current observed state

```text
LOCAL_VELOCITY = OBSERVED_AND_COMMITTED
ACTIVE_GCLOUD_IDENTITY = OBSERVED_ABSENT_IN_RUN_20260710T224305Z
GOOGLE_PROJECT_CONTROL = UNPROVEN
WALLET_CONTROL = UNPROVEN
MARKETPLACE_INCOME = UNPROVEN
AUTHORITY = FALSE
```

Referenced commits:

```text
velocity receipt commit = afea9b02d5234f8dc9f64483c7b2b999b6df1fc8
identity absence commit = 27dda6464636611638e0aea89c493ffe2d18d4fa
manifest binding commit = e02492e06c2ae83da19333706c48ef803c2d8420
```

---

## Lane A — Authenticated Google-control capture

The identity capture script does not initiate authentication. The operator must first establish an active `gcloud` session interactively.

### 1. Inspect existing authentication

```bash
gcloud auth list
gcloud config get-value account
gcloud config get-value project
```

### 2. Authenticate only through Google’s interactive flow

```bash
gcloud auth login
```

Do not paste access tokens, refresh tokens, cookies, authorization codes, or credential files into GitHub, chat, receipts, or issue comments.

### 3. Select the observed account and project

Replace the account placeholder only with an account shown by `gcloud auth list`.

```bash
gcloud config set account YOUR_OBSERVED_ACCOUNT
gcloud config set project jaywisdom-boardroom
```

Project selection configures the CLI context. It does not prove ownership or control.

### 4. Re-run the read-only capture

```bash
cd ~/public-proof
git checkout proof-portal-v0
git pull --ff-only

chmod +x scripts/capture_gcloud_identity_v0_1.sh
./scripts/capture_gcloud_identity_v0_1.sh

LATEST="$(find receipts/gcloud_identity_v0_1 \
  -mindepth 1 -maxdepth 1 -type d | sort | tail -1)"

printf 'LATEST=%s\n' "$LATEST"
cat "$LATEST/state.json"
cat "$LATEST/evidence_manifest.sha256"
```

### 5. Review before commit

Inspect the generated files for personal information before committing:

```bash
find "$LATEST" -maxdepth 1 -type f -print
```

The IAM policy export may contain email addresses. Redact only by producing a new redacted derivative while preserving the original local file outside Git history. Do not silently edit a committed receipt.

### 6. Commit the reviewed capture

```bash
git add "$LATEST"
git commit -m "docs(receipts): add authenticated gcloud identity capture"
git push origin proof-portal-v0
```

### Google-lane promotion rules

```text
active account observed
+ project metadata returned
+ billing link query returned or failed with preserved output
+ IAM policy returned or failed with preserved output
+ receipt directory committed
+ hashes recomputable
= AUTHENTICATED_GOOGLE_SURFACE_OBSERVED
```

This does **not** prove wallet control, Marketplace approval, production readiness, revenue, or government authority.

---

## Lane B — Wallet signature capture

Canonical payload source:

```text
receipts/signing_message_hex_v0_1.txt
```

Canonical payload SHA in Git:

```text
blob sha = 9f0ea1af8ba60690544ef2eeb2b83f51149dba3b
```

Expected wallet address:

```text
0xa380552a27b0a5a2874ea7aa52cac09f542002e8
```

Network context:

```text
eip155:8453
```

### Signing boundary

Use the wallet’s normal signing interface for the exact canonical hex payload. Never provide:

```text
private key
seed phrase
recovery phrase
wallet export
session token
signing secret
```

The only admissible return value is the public signature string produced by the wallet, plus optional wallet UI screenshots that contain no secret material.

### Signature intake format

```text
signature = 0x...
message_path = receipts/signing_message_hex_v0_1.txt
expected_address = 0xa380552a27b0a5a2874Ea7AA52CAC09f542002E8
network = eip155:8453
```

### Wallet-lane promotion rules

1. Re-read the exact canonical message bytes.
2. Detect account type on Base.
3. For an EOA candidate, recover the signer from the exact message.
4. For a smart-account candidate, use ERC-1271 or the applicable account-validation path.
5. Require exact expected-address validity.
6. Preserve the verification receipt and SHA-256.

```text
SIGNATURE_PRESENT != WALLET_CONTROL_PROVEN
```

Wallet control may advance only after the applicable verification path succeeds.

---

## Join rule

The lanes may be merged into the 50/50 manifest only after both have independently produced committed receipts.

```text
GOOGLE_LANE_RECEIPT
+
WALLET_LANE_RECEIPT
+
INDEPENDENT_HASH_RECOMPUTATION
=
BINDING_ELIGIBLE
```

Until then:

```text
CURRENT_RESULT = BOTH_OBSERVED_NOT_BOUND
AUTHORITY = FALSE
NO_FAKE_GREEN = TRUE
NO_FAKE_RED = TRUE
```
