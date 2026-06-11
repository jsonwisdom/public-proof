# CRP_VALIDATION_FIXTURE_SET_V0_1

## 1. Purpose and Scope

Define the immutable, versioned, hash-addressed fixture set for CRP V0.1 validation.

Fixtures provide deterministic test inputs for:

- Schema validation
- API contract conformance
- UI rendering determinism
- Authority propagation
- Cross-layer integrity

No inline JSON in runner code. All test data must come from this fixture set.

## 2. Constitutional Binding

- Binds to: `CRP_V0_1_SPEC_FREEZE_README@e3b4b520c420936b86a879de59e1c783b9781367`
- Fixtures frozen at V0.1 spec freeze boundary
- Immutability: once declared, fixtures never change
- Hash addressing: each fixture identified by SHA256 of its content

## 3. Fixture Categories

| Category | Purpose | Count planned |
|---|---|---:|
| schema | Test schema validation rules | 14 |
| api | Test API contract conformance | 24 |
| ui | Test rendering determinism | 12 |
| authority | Test `authority: false` propagation | 8 |
| cross_layer | Test no semantic change across layers | 10 |

## 4. Addressing Scheme

Format:

```text
fixture://sha256:<64-character-hash>
```

Resolution: Runner loads from path mapped in manifest.

Verification: Runner must recompute hash and reject on mismatch.

## 5. Versioning Rules

| Rule | Description |
|---|---|
| Immutability | Fixture content never modified after declaration |
| Hash change | Any content change produces new hash and new fixture |
| Version freeze | V0.1 fixture set locked to spec freeze SHA |
| Deprecation | Old fixtures retained; never deleted from archive |

## 6. Directory Structure

```text
fixtures/crp/v0.1/
├── manifest.json
├── schema/
│   ├── entry_valid.json
│   ├── entry_missing_id.json
│   ├── entry_wrong_timestamp.json
│   ├── index_valid.json
│   ├── aggregation_valid.json
│   ├── convergence_valid.json
│   ├── floor_valid.json
│   ├── observer_valid.json
│   └── meta_valid.json
├── api/
│   ├── entry_request_valid.json
│   ├── entry_response_202.json
│   ├── entry_response_400.json
│   ├── entry_response_422.json
│   ├── index_request_valid.json
│   ├── similar_for_all_12_endpoints.json
│   └── ...
├── ui/
│   ├── entry_payload_001.json
│   ├── expected_ui_tree_001.json
│   ├── observer_interpretation_001.json
│   └── ...
├── authority/
│   ├── payload_with_authority_false.json
│   ├── payload_without_authority_field.json
│   └── ...
└── cross_layer/
    ├── entry_to_index_chain.json
    ├── aggregation_to_convergence_chain.json
    └── ...
```

## 7. Manifest Format

Location: `fixtures/crp/v0.1/manifest.json`

```json
{
  "version": "0.1",
  "spec_freeze_sha": "e3b4b520c420936b86a879de59e1c783b9781367",
  "generated": "2026-06-11T23:00:00Z",
  "fixtures": [
    {
      "id": "schema_entry_valid_001",
      "category": "schema",
      "hash": "sha256:a1b2c3d4e5f678901234567890123456789012345678901234567890123456789",
      "path": "fixtures/crp/v0.1/schema/entry_valid.json"
    },
    {
      "id": "api_entry_request_valid_001",
      "category": "api",
      "hash": "sha256:b2c3d4e5f6789012345678901234567890123456789012345678901234567890ab",
      "path": "fixtures/crp/v0.1/api/entry_request_valid.json"
    }
  ],
  "authority": false
}
```

## 8. Example Fixtures

### 8.1 Schema Fixture: Valid Entry

Path: `fixtures/crp/v0.1/schema/entry_valid.json`

```json
{
  "entry_id": "ent_validation_001",
  "timestamp": "2026-06-11T22:00:00Z",
  "payload": {
    "source": "sensor_a",
    "value": 42,
    "unit": "celsius"
  }
}
```

Hash: `sha256:a1b2c3d4e5f678901234567890123456789012345678901234567890123456789`

### 8.2 Schema Fixture: Invalid Entry Missing ID

Path: `fixtures/crp/v0.1/schema/entry_missing_id.json`

```json
{
  "timestamp": "2026-06-11T22:00:00Z",
  "payload": {
    "source": "sensor_a",
    "value": 42
  }
}
```

Hash: `sha256:c3d4e5f6789012345678901234567890123456789012345678901234567890ab12`

### 8.3 API Fixture: Entry Request Valid

Path: `fixtures/crp/v0.1/api/entry_request_valid.json`

```json
{
  "method": "POST",
  "endpoint": "/api/v0.1/entry",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "entry_id": "ent_api_001",
    "timestamp": "2026-06-11T22:30:00Z",
    "payload": {
      "test": "fixture_driven"
    }
  }
}
```

### 8.4 API Fixture: Expected Response

Path: `fixtures/crp/v0.1/api/entry_response_202.json`

```json
{
  "status_code": 202,
  "body_pattern": {
    "status": "accepted",
    "entry": {
      "entry_id": "ent_api_001",
      "timestamp": "2026-06-11T22:30:00Z",
      "payload": {
        "test": "fixture_driven"
      }
    },
    "authority": false,
    "semantic_change": false
  }
}
```

### 8.5 Authority Fixture: With False

Path: `fixtures/crp/v0.1/authority/payload_with_authority_false.json`

```json
{
  "entry_id": "ent_auth_001",
  "timestamp": "2026-06-11T23:00:00Z",
  "payload": {},
  "authority": false
}
```

### 8.6 Cross-Layer Fixture: Entry to Index

Path: `fixtures/crp/v0.1/cross_layer/entry_to_index_chain.json`

```json
{
  "description": "Entry payload should pass unchanged to Index layer",
  "entry": {
    "entry_id": "ent_chain_001",
    "timestamp": "2026-06-11T23:15:00Z",
    "payload": {
      "value": 100
    }
  },
  "index_expected": {
    "index_id": "idx_chain_001",
    "entry_id": "ent_chain_001",
    "coordinates": {
      "position": 0
    }
  },
  "authority": false
}
```

## 9. Fixture Lifecycle

```text
DECLARE → HASH → LOCK → VERIFY → USE → ARCHIVE
```

| Phase | Description |
|---|---|
| DECLARE | Fixture content written to path |
| HASH | SHA256 computed and recorded in manifest |
| LOCK | Manifest frozen for V0.1 |
| VERIFY | Runner recomputes hash before use |
| USE | Fixture consumed by validation tests |
| ARCHIVE | Never deleted; retained for replay |

## 10. Forbidden Practices

- No inline fixtures in test code
- No path-based references without hash verification
- No mutable fixtures after freeze
- No implicit fixture generation at runtime
- No network-fetched fixtures

## 11. Final Summary Object

```json
{
  "CRP_VALIDATION_FIXTURE_SET_V0_1": {
    "binding": "CRP_V0_1_SPEC_FREEZE_README@e3b4b520c420936b86a879de59e1c783b9781367",
    "categories": ["schema", "api", "ui", "authority", "cross_layer"],
    "total_fixtures": 68,
    "hash_addressed": true,
    "immutable": true,
    "authority": false,
    "next_artifact": "CRP_VALIDATION_RUNNER_SOURCE_V0_1"
  }
}
```
