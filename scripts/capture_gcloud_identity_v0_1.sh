#!/usr/bin/env bash
set -u
set -o pipefail

PROJECT_NUMBER="311690651351"
PROJECT_ID="jaywisdom-boardroom"
RUN_ID="$(date -u +%Y%m%dT%H%M%SZ)"
OUT="receipts/gcloud_identity_v0_1/${RUN_ID}"
mkdir -p "$OUT"

capture() {
  local name="$1"
  shift
  {
    printf '$'
    printf ' %q' "$@"
    printf '\n'
    "$@"
    local rc=$?
    printf '\nEXIT_CODE=%s\n' "$rc"
    return "$rc"
  } >"$OUT/$name" 2>&1
}

capture auth_inventory.json.log \
  gcloud auth list --format=json || true

capture configured_account.txt \
  gcloud config get-value account || true

capture configured_project.txt \
  gcloud config get-value project || true

ACTIVE_ACCOUNT="$(gcloud auth list --filter=status:ACTIVE --format='value(account)' 2>/dev/null | head -n1 || true)"

if [ -z "$ACTIVE_ACCOUNT" ]; then
  cat > "$OUT/state.json" <<EOF
{
  "artifact_type": "GCLOUD_IDENTITY_CAPTURE_STATE",
  "version": "0.1",
  "run_id": "$RUN_ID",
  "project_number": "$PROJECT_NUMBER",
  "project_id_reported": "$PROJECT_ID",
  "active_gcloud_identity": "ABSENT",
  "project_metadata": "NOT_ATTEMPTED_WITHOUT_ACTIVE_IDENTITY",
  "iam_policy": "NOT_ATTEMPTED_WITHOUT_ACTIVE_IDENTITY",
  "billing_link": "NOT_ATTEMPTED_WITHOUT_ACTIVE_IDENTITY",
  "resources_created": false,
  "apis_enabled": false,
  "iam_modified": false,
  "billing_modified": false,
  "authority": false,
  "no_fake_green": true,
  "no_fake_red": true
}
EOF
else
  capture active_account.txt \
    gcloud auth list --filter=status:ACTIVE --format='value(account)' || true

  capture project_describe_by_id.json.log \
    gcloud projects describe "$PROJECT_ID" --format=json || true

  capture project_describe_by_number.json.log \
    gcloud projects describe "$PROJECT_NUMBER" --format=json || true

  capture enabled_services.json.log \
    gcloud services list --enabled --project "$PROJECT_ID" --format=json || true

  capture billing_project_link.json.log \
    gcloud billing projects describe "$PROJECT_ID" --format=json || true

  capture iam_policy.json.log \
    gcloud projects get-iam-policy "$PROJECT_ID" --format=json || true

  cat > "$OUT/state.json" <<EOF
{
  "artifact_type": "GCLOUD_IDENTITY_CAPTURE_STATE",
  "version": "0.1",
  "run_id": "$RUN_ID",
  "project_number": "$PROJECT_NUMBER",
  "project_id_reported": "$PROJECT_ID",
  "active_gcloud_identity": "OBSERVED_IN_ACTIVE_ACCOUNT_RECEIPT",
  "project_metadata": "SEE_PROJECT_DESCRIBE_RECEIPTS",
  "enabled_services": "SEE_ENABLED_SERVICES_RECEIPT",
  "iam_policy": "SEE_IAM_POLICY_RECEIPT",
  "billing_link": "SEE_BILLING_PROJECT_LINK_RECEIPT",
  "resources_created": false,
  "apis_enabled": false,
  "iam_modified": false,
  "billing_modified": false,
  "authority": false,
  "no_fake_green": true,
  "no_fake_red": true
}
EOF
fi

(
  cd "$OUT"
  find . -maxdepth 1 -type f \
    ! -name 'evidence_manifest.sha256' \
    ! -name 'evidence_manifest.sha256.sha256' \
    -print0 \
  | sort -z \
  | xargs -0 sha256sum > evidence_manifest.sha256
  sha256sum evidence_manifest.sha256 > evidence_manifest.sha256.sha256
)

printf 'Identity evidence created at: %s\n' "$OUT"
printf 'No login initiated. No APIs enabled. No resources created.\n'
printf 'Review before committing.\n'
