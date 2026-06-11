# CRP_VALIDATION_CI_WORKFLOW_V0_1

## 1. Purpose and Scope

Define how the validation runner is invoked, gated, reported, and archived in continuous integration (CI).

This is a workflow definition, not an execution claim. It describes intended behavior; it does not assert that any CI run has occurred or that validation has passed.

- Binds to runner source: `CRP_VALIDATION_RUNNER_SOURCE_V0_1@1d72bc2a45956ce80a8d10b25ec63ea045a2bd12`
- Binds to fixture set: `CRP_VALIDATION_FIXTURE_SET_V0_1@a11475bd4ec8dc9365c41acff72346af6b72ccce`
- Preserves `authority: false` at workflow level

## 2. Workflow Triggers

| Trigger | Behavior |
|---|---|
| push to main on paths affecting CRP artifacts | Run full validation suite |
| pull_request targeting main | Run validation, report but do not block merge informationally by default |
| workflow_dispatch | Allow manual trigger with selectable categories |
| schedule daily | Run full suite and archive report |

## 3. Job Definition

### 3.1 Job: validate-crp

Runs on: `ubuntu-latest`

Steps:

```yaml
- name: Checkout repository
  uses: actions/checkout@v4
  with:
    fetch-depth: 0  # full history for SHA verification

- name: Setup runner environment
  run: |
    # In real implementation, install crp-validate from source
    echo "CRP validation runner v0.1 (definition only)"

- name: Verify fixture integrity
  run: |
    # Recompute hashes against manifest
    crp-validate --manifest fixtures/crp/v0.1/manifest.json \
                 --categories schema \
                 --verify-only

- name: Run schema validation
  run: |
    crp-validate --manifest fixtures/crp/v0.1/manifest.json \
                 --categories schema \
                 --report reports/schema_report.json

- name: Run API conformance
  run: |
    crp-validate --manifest fixtures/crp/v0.1/manifest.json \
                 --categories api \
                 --report reports/api_report.json

- name: Run UI determinism
  run: |
    crp-validate --manifest fixtures/crp/v0.1/manifest.json \
                 --categories ui \
                 --report reports/ui_report.json

- name: Run authority propagation
  run: |
    crp-validate --manifest fixtures/crp/v0.1/manifest.json \
                 --categories authority \
                 --report reports/authority_report.json

- name: Run cross-layer integrity
  run: |
    crp-validate --manifest fixtures/crp/v0.1/manifest.json \
                 --categories cross_layer \
                 --report reports/cross_layer_report.json

- name: Aggregate reports
  run: |
    # Combine individual category reports into final validation report
    python scripts/aggregate_reports.py --output reports/validation_report.json

- name: Archive validation reports
  uses: actions/upload-artifact@v4
  with:
    name: crp-validation-reports
    path: reports/
    retention-days: 90

- name: Comment PR with summary if pull_request
  if: github.event_name == 'pull_request'
  run: |
    # Post summary of RED/YELLOW counts
    python scripts/pr_comment.py --report reports/validation_report.json
```

## 4. Gating Policy

### 4.1 Branch Protection Rules Intended

| Condition | Action |
|---|---|
| Any RED result in schema, api, authority, or cross_layer categories | Block merge; exit code 1 |
| RED only in ui category | Warning, but may merge; non-semantic |
| YELLOW results constitutional assumptions | Informational, never block |
| Runner error exit code 2 | Block merge, require manual review |

### 4.2 Exit Code Interpretation in CI

```json
{
  "exit_0": {
    "ci_action": "allow_merge",
    "ci_output": "No RED results (YELLOW may exist). Not a verification claim."
  },
  "exit_1": {
    "ci_action": "block_merge",
    "ci_output": "RED results detected. Validation failed per CRP discipline."
  },
  "exit_2": {
    "ci_action": "block_merge_manual_review",
    "ci_output": "Runner or configuration error. Human intervention required."
  }
}
```

## 5. Reporting and Archiving

### 5.1 Report Artifacts

| File | Contents |
|---|---|
| `validation_report.json` | Full machine-readable report per runner spec |
| `summary.md` | Human-readable summary, auto-generated |
| `fixture_manifest.lock` | Locked fixture SHAs used in the run |

### 5.2 Archive Retention

- Reports retained for 90 days in CI artifact storage
- Critical reports with RED results may be archived to long-term storage with versioning
- Archive path: `s3://crp-validation-reports/v0.1/YYYY/MM/DD/<commit-sha>/`

## 6. Non-Authority Guarantees in CI

CI workflow must:

- Never add badges like CRP verified or validation passed
- Never treat exit code 0 as certification
- Always display YELLOW counts prominently as constitutional assumptions
- Never suppress RED results
- Never claim that validation implies correctness, truth, or authority

Example PR comment footer required:

```markdown
## CRP Validation Summary

| Category | Green | Yellow | Red |
|----------|-------|--------|-----|
| schema   | 12    | 0      | 2   |
| api      | 22    | 0      | 2   |
| ui       | 10    | 1      | 1   |
| authority| 8     | 0      | 0   |
| cross_layer| 6  | 4      | 0   |

**Exit code:** 1 (RED present)

> **Note:** This validation run reports conformance to CRP V0.1 specifications.
> It does not certify correctness, truth, or authority. YELLOW results indicate
> constitutional assumptions not yet Git-backed. See CRP discipline docs.
```

## 7. Security and Permissions

| Requirement | Setting |
|---|---|
| Read-only checkout | `contents: read` |
| No write permissions to repository default | `contents: write` forbidden for validation job |
| No secrets required | Validation is offline and fixture-based |
| Isolated execution | Runner does not access external network |

## 8. Required Scripts Definition

The CI workflow references two helper scripts, which must be defined but are not part of this artifact.

### 8.1 `scripts/aggregate_reports.py`

- Input: individual category reports JSON
- Output: combined `validation_report.json` per runner spec
- Deterministic: same inputs produce same aggregated report

### 8.2 `scripts/pr_comment.py`

- Input: `validation_report.json`
- Output: Markdown comment posted to PR
- Must include non-authority disclaimer
- Must never auto-approve PR

## 9. Example CI Run Output Conceptual

```json
{
  "workflow": "crp-validation",
  "trigger": "push",
  "commit": "f7e3a1b2...",
  "timestamp": "2026-06-11T23:45:00Z",
  "exit_code": 1,
  "summary": {
    "green": 58,
    "yellow": 5,
    "red": 5,
    "block_merge": true
  },
  "artifacts": [
    "reports/validation_report.json",
    "reports/summary.md",
    "fixture_manifest.lock"
  ],
  "authority": false
}
```

## 10. Final Summary Object

```json
{
  "CRP_VALIDATION_CI_WORKFLOW_V0_1": {
    "binding": {
      "runner_source": "1d72bc2a45956ce80a8d10b25ec63ea045a2bd12",
      "fixture_set": "a11475bd4ec8dc9365c41acff72346af6b72ccce"
    },
    "triggers": ["push", "pull_request", "workflow_dispatch", "schedule"],
    "gating_policy": {
      "block_on_red": true,
      "yellow_allowed": true,
      "exit_2_requires_manual_review": true
    },
    "authority": false,
    "status": "DEFINITION_ONLY_NO_EXECUTION_CLAIMED",
    "next_artifact": null
  }
}
```
