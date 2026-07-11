#!/usr/bin/env bash
set -u
set -o pipefail

PROJECT_NUMBER="311690651351"
PROJECT_ID="jaywisdom-boardroom"
RUN_ID="$(date -u +%Y%m%dT%H%M%SZ)"
OUT="receipts/cloud_velocity_v0_2/${RUN_ID}"
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

# Read-only cloud observations. Failures are preserved as evidence.
capture project_describe.txt \
  gcloud projects describe "$PROJECT_NUMBER" --format=json || true

capture enabled_services.json.log \
  gcloud services list --enabled --project "$PROJECT_ID" --format=json || true

capture billing_project_link.json.log \
  gcloud billing projects describe "$PROJECT_ID" --format=json || true

capture configured_account.txt \
  gcloud config get-value account || true

capture configured_project.txt \
  gcloud config get-value project || true

capture auth_inventory.json.log \
  gcloud auth list --format=json || true

capture active_account.txt \
  gcloud auth list --filter='status:ACTIVE' --format='value(account)' || true

python3 - "$OUT" "$PROJECT_NUMBER" "$PROJECT_ID" <<'PY'
import hashlib
import json
import pathlib
import statistics
import sys
import time

out = pathlib.Path(sys.argv[1])
project_number = sys.argv[2]
project_id = sys.argv[3]

payload = {
    "receipt": "JAY_VELOCITY_TRIAL",
    "tempo_bpm": 128,
    "authority": False,
    "no_fake_green": True,
}

json_trials = []
for _ in range(5):
    started = time.perf_counter()
    for i in range(10000):
        encoded = json.dumps({**payload, "sequence": i}, separators=(",", ":"))
        json.loads(encoded)
    json_trials.append(time.perf_counter() - started)

hash_trials = []
base = b'{"jay":"velocity","authority":false}'
for _ in range(5):
    started = time.perf_counter()
    for i in range(25000):
        hashlib.sha256(base + str(i).encode()).digest()
    hash_trials.append(time.perf_counter() - started)

json_median = statistics.median(json_trials)
hash_median = statistics.median(hash_trials)

report = {
    "artifact_type": "JAY_VELOCITY_JSON_TRIAL",
    "version": "0.2",
    "run_id": out.name,
    "project_number": project_number,
    "project_id_reported": project_id,
    "json": {
        "documents_per_trial": 10000,
        "trial_seconds": [round(x, 6) for x in json_trials],
        "median_seconds": round(json_median, 6),
        "documents_per_second": round(10000 / json_median, 2),
    },
    "sha256": {
        "hashes_per_trial": 25000,
        "trial_seconds": [round(x, 6) for x in hash_trials],
        "median_seconds": round(hash_median, 6),
        "hashes_per_second": round(25000 / hash_median, 2),
    },
    "cloud_metadata_verified": False,
    "production_capacity_proven": False,
    "marketplace_income_proven": False,
    "authority": False,
    "no_fake_green": True,
    "no_fake_red": True,
}

path = out / "jay_velocity_json_trial_v0_2.json"
path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
digest = hashlib.sha256(path.read_bytes()).hexdigest()
(out / "jay_velocity_json_trial_v0_2.sha256").write_text(
    f"{digest}  {path.name}\n", encoding="utf-8"
)


def command_payload(path: pathlib.Path) -> list[str]:
    if not path.exists():
        return []
    lines = path.read_text(encoding="utf-8", errors="replace").splitlines()
    return [
        line.strip()
        for line in lines
        if line.strip()
        and not line.startswith("$")
        and not line.startswith("EXIT_CODE=")
        and not line.startswith("WARNING:")
    ]

configured_accounts = command_payload(out / "configured_account.txt")
configured_projects = command_payload(out / "configured_project.txt")
active_accounts = command_payload(out / "active_account.txt")

identity_state = "ACTIVE_IDENTITY_OBSERVED" if active_accounts else "ACTIVE_IDENTITY_ABSENT"

state = {
    "artifact_type": "CLOUD_VELOCITY_CAPTURE_STATE",
    "version": "0.2",
    "run_id": out.name,
    "project_number": project_number,
    "project_id_reported": project_id,
    "configured_account_observed": configured_accounts[0] if configured_accounts else None,
    "configured_project_observed": configured_projects[0] if configured_projects else None,
    "active_accounts_observed": active_accounts,
    "active_identity_state": identity_state,
    "cloud_resource_manager_state": "SEE_PROJECT_DESCRIBE_RECEIPT",
    "enabled_services_state": "SEE_ENABLED_SERVICES_RECEIPT",
    "billing_link_state": "SEE_BILLING_PROJECT_LINK_RECEIPT",
    "auth_inventory_state": "SEE_AUTH_INVENTORY_RECEIPT",
    "local_json_trial": "EXECUTED",
    "local_hash_trial": "EXECUTED",
    "production_capacity": "UNPROVEN",
    "marketplace_income": "UNPROVEN",
    "authority": False,
    "no_fake_green": True,
    "no_fake_red": True,
}
(out / "state.json").write_text(json.dumps(state, indent=2) + "\n", encoding="utf-8")
PY

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

printf 'Artifacts created at: %s\n' "$OUT"
printf 'No APIs enabled. No resources created. No IAM or billing changes performed.\n'
printf 'Review files before committing.\n'
