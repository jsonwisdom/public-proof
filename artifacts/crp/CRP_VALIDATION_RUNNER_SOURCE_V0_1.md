# CRP_VALIDATION_RUNNER_SOURCE_V0_1

## 1. Purpose and Scope

Define the executable validation runner that:

- Consumes fixtures from `CRP_VALIDATION_FIXTURE_SET_V0_1`
- Recomputes SHA256 hashes before execution
- Rejects any hash mismatch
- Executes category-specific validation tests
- Produces deterministic validation reports
- Preserves `authority: false` throughout execution and reporting

This is source definition, not execution claim.

## 2. Constitutional Binding

```json
{
  "binding": {
    "spec_freeze": "CRP_V0_1_SPEC_FREEZE_README@e3b4b520c420936b86a879de59e1c783b9781367",
    "fixture_set": "CRP_VALIDATION_FIXTURE_SET_V0_1@a11475bd4ec8dc9365c41acff72346af6b72ccce"
  },
  "authority": false
}
```

## 3. Runner Core Interface

### 3.1 Command Signature

```bash
crp-validate \
  --manifest fixtures/crp/v0.1/manifest.json \
  --categories schema,api,ui,authority,cross_layer \
  --report out/report.json \
  [--fail-fast] \
  [--seed 42]
```

### 3.2 Exit Codes

| Code | Meaning |
|---:|---|
| 0 | No RED results; YELLOW allowed |
| 1 | One or more RED results |
| 2 | Runner/config error: hash mismatch, missing manifest, invalid category |

### 3.3 Required Flags

| Flag | Description |
|---|---|
| `--manifest` | Path to fixture manifest JSON |
| `--categories` | Comma-separated list of test categories to run |
| `--report` | Output path for validation report |

## 4. Execution Lifecycle

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. LOAD_MANIFEST                                            │
│    - Read manifest.json                                     │
│    - Verify fixture set SHA matches expected                │
├─────────────────────────────────────────────────────────────┤
│ 2. VERIFY_FIXTURES                                          │
│    - For each fixture in requested categories               │
│    - Recompute SHA256 from file content                     │
│    - Compare to manifest hash                               │
│    - Exit code 2 on ANY mismatch                            │
├─────────────────────────────────────────────────────────────┤
│ 3. RUN_SCHEMA_TESTS                                         │
│    - Load schema fixtures                                   │
│    - Validate against normalized schemas (@722fb564)        │
│    - Report GREEN/RED per fixture                           │
├─────────────────────────────────────────────────────────────┤
│ 4. RUN_API_TESTS                                            │
│    - Load API request/response fixtures                     │
│    - Validate against API contracts (@a0e4185b)             │
│    - Report GREEN/RED per endpoint                          │
├─────────────────────────────────────────────────────────────┤
│ 5. RUN_UI_TESTS                                             │
│    - Load UI payload fixtures                               │
│    - Render to UI tree deterministically                    │
│    - Compare to expected tree by hash                       │
│    - Report GREEN/RED per test                              │
├─────────────────────────────────────────────────────────────┤
│ 6. RUN_AUTHORITY_TESTS                                      │
│    - Verify authority: false is never overridden            │
│    - Verify no authority badges or claims emerge            │
│    - Report GREEN/RED per assertion                         │
├─────────────────────────────────────────────────────────────┤
│ 7. RUN_CROSS_LAYER_TESTS                                    │
│    - Verify data passes through layers without semantic change│
│    - Report GREEN/YELLOW/RED per chain                      │
│    - YELLOW for constitutional assumptions                  │
├─────────────────────────────────────────────────────────────┤
│ 8. AGGREGATE_REPORT                                         │
│    - Per-category counts                                    │
│    - Global summary                                         │
│    - Highest severity determination                         │
├─────────────────────────────────────────────────────────────┤
│ 9. WRITE_REPORT                                             │
│    - Write JSON report to --report path                     │
│    - Include all test results, timestamps, SHAs             │
├─────────────────────────────────────────────────────────────┤
│10. EXIT                                                     │
│    - Determine exit code: 0, 1, or 2                        │
│    - Never claim verification beyond no RED                 │
└─────────────────────────────────────────────────────────────┘
```

## 5. Test Execution Pseudocode

### 5.1 Schema Test Runner

```python
def run_schema_tests(manifest, schema_loader):
    results = []
    for fixture in manifest.get_fixtures(category="schema"):
        content = load_fixture(fixture.path)

        # Determine expected outcome from fixture metadata
        expected_valid = fixture.metadata.get("expected_valid", True)

        try:
            validate_against_schema(content, fixture.schema_id)
            actual_valid = True
        except ValidationError:
            actual_valid = False

        status = "GREEN" if actual_valid == expected_valid else "RED"

        results.append({
            "fixture_id": fixture.id,
            "status": status,
            "expected": expected_valid,
            "actual": actual_valid
        })

    return results
```

### 5.2 Authority Test Runner

```python
def run_authority_tests(manifest):
    results = []

    # Test 1: authority: false preserved
    fixture = manifest.get_fixture("authority_payload_with_false")
    payload = load_fixture(fixture.path)

    if payload.get("authority") is False:
        status = "GREEN"
    else:
        status = "RED"

    results.append({
        "test": "authority_false_preserved",
        "status": status
    })

    # Test 2: no authority field defaults to false per spec
    fixture = manifest.get_fixture("authority_payload_without_field")
    payload = load_fixture(fixture.path)

    if payload.get("authority", False) is False:
        status = "GREEN"
    else:
        status = "RED"

    results.append({
        "test": "authority_missing_defaults_to_false",
        "status": status
    })

    return results
```

### 5.3 Cross-Layer Test Runner

```python
def run_cross_layer_tests(manifest):
    results = []

    for fixture in manifest.get_fixtures(category="cross_layer"):
        chain = load_fixture(fixture.path)

        # Determine if constitutional layers are Git-backed
        constitutional_commit = chain.metadata.get("constitutional_commit")

        if constitutional_commit is None:
            status = "YELLOW"
            message = "Constitutional layer not Git-backed"
        else:
            # Verify semantic preservation
            entry_payload = chain["entry"]["payload"]
            index_payload = chain["index"]["coordinates"]

            if entry_payload == index_payload:
                status = "GREEN"
            else:
                status = "RED"
            message = ""

        results.append({
            "fixture_id": fixture.id,
            "status": status,
            "message": message
        })

    return results
```

## 6. Report Format

### 6.1 Full Report Structure

```json
{
  "report_id": "uuid-550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2026-06-11T23:30:00Z",
  "runner_version": "v0.1",
  "bindings": {
    "spec_freeze": "e3b4b520c420936b86a879de59e1c783b9781367",
    "fixture_set": "a11475bd4ec8dc9365c41acff72346af6b72ccce"
  },
  "categories": ["schema", "api", "ui", "authority", "cross_layer"],
  "results": {
    "schema": {
      "total": 14,
      "green": 12,
      "red": 2,
      "yellow": 0,
      "failures": [
        {
          "fixture_id": "schema_entry_missing_id",
          "status": "RED",
          "message": "Expected invalid but validation passed"
        }
      ]
    },
    "api": {
      "total": 24,
      "green": 22,
      "red": 2,
      "yellow": 0
    },
    "ui": {
      "total": 12,
      "green": 10,
      "red": 1,
      "yellow": 1
    },
    "authority": {
      "total": 8,
      "green": 8,
      "red": 0,
      "yellow": 0
    },
    "cross_layer": {
      "total": 10,
      "green": 6,
      "red": 0,
      "yellow": 4
    }
  },
  "summary": {
    "total": 68,
    "green": 58,
    "yellow": 5,
    "red": 5,
    "highest_severity": "RED",
    "exit_code": 1
  },
  "authority": false,
  "semantic_change": false
}
```

## 7. Determinism Requirements

| Requirement | Implementation |
|---|---|
| Stable ordering | Sort fixtures by ID before execution |
| Seeded randomness | Use `--seed` for any non-deterministic operations |
| No time dependence | Use fixed timestamps from fixtures, not `now()` |
| Repeatable hashes | SHA256 of content, not path or timestamp |
| Version locking | Runner version recorded in report |

## 8. Error Handling

### 8.1 Hash Mismatch

```json
{
  "error": "fixture_hash_mismatch",
  "fixture_id": "schema_entry_valid_001",
  "expected_hash": "sha256:a1b2c3...",
  "actual_hash": "sha256:d4e5f6...",
  "action": "exit_code_2"
}
```

### 8.2 Missing Manifest

```json
{
  "error": "manifest_not_found",
  "path": "fixtures/crp/v0.1/manifest.json",
  "action": "exit_code_2"
}
```

### 8.3 Invalid Category

```json
{
  "error": "invalid_category",
  "provided": "invalid_category_name",
  "valid": ["schema", "api", "ui", "authority", "cross_layer"],
  "action": "exit_code_2"
}
```

## 9. Forbidden Runner Behaviors

- No execution claims: runner cannot state tests passed without actual run
- No authority elevation: report cannot add verified or certified badges
- No silent skips: all requested categories must execute or error
- No inline fixtures: only manifest-declared, hash-verified fixtures
- No network dependencies: offline-capable execution
- No mutation: runner cannot modify fixture files or manifest

## 10. Final Summary Object

```json
{
  "CRP_VALIDATION_RUNNER_SOURCE_V0_1": {
    "binding": {
      "spec_freeze": "e3b4b520c420936b86a879de59e1c783b9781367",
      "fixture_set": "a11475bd4ec8dc9365c41acff72346af6b72ccce"
    },
    "exit_codes": {
      "0": "NO_RED_RESULTS",
      "1": "RED_PRESENT",
      "2": "RUNNER_ERROR"
    },
    "categories": ["schema", "api", "ui", "authority", "cross_layer"],
    "deterministic": true,
    "hash_verification_required": true,
    "authority": false,
    "next_artifact": "CRP_VALIDATION_CI_WORKFLOW_V0_1"
  }
}
```
