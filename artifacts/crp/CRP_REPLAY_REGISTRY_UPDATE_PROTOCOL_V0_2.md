# CRP_REPLAY_REGISTRY_UPDATE_PROTOCOL_V0_2

## 1. Purpose and scope

**Purpose:**
Govern V0.2 schema-aligned replay registry entries with explicit rules for:

- commit-binding
- supersede mechanics
- witness enums
- sealed registry behavior
- external witness evidence

**Scope:**

- Data: `CRP_REPLAY_REGISTRY_V0_2.json`
- Schema: `CRP_REPLAY_REGISTRY_SCHEMA_V0_2.json`
- Protocol: this document

**Non-authority clause:**

- `authority: false`
- `no_fake_green: true`

This protocol does not claim ultimate truth; it only governs how entries are recorded and evolved.

---

## 2. Core invariants

**I1: Append-only:**

- Existing entries in `entries[]` MUST NOT be mutated or deleted.
- All changes are realized as new entries or new commits that patch metadata, such as self-binding.

**I2: No authority inflation:**

- Top-level and per-entry authority MUST remain false.

**I3: No fake green:**

- No entry may claim `replay_outcome: "GREEN_MATCH"` without:
  - a replayable basis, and
  - a witness record consistent with this protocol.

**I4: Schema alignment:**

- Every entry MUST validate against `CRP_REPLAY_REGISTRY_SCHEMA_V0_2.json`.

**I5: Git-visible history:**

- All changes MUST be committed to Git.
- No out-of-band mutation is allowed.

---

## 3. Versioning and binding

### 3.1 Required version fields

Each entry MUST include:

- `schema_version`: `CRP_REPLAY_REGISTRY_SCHEMA_V0_2`
- `protocol_version`: `CRP_REPLAY_REGISTRY_UPDATE_PROTOCOL_V0_2`
- `registry_entry_created_at`: ISO-8601 UTC timestamp string.
- `registry_entry_commit_sha`: Git commit SHA that introduced the entry.

### 3.2 Formal two-commit self-binding rule

**Rule SB1: Unknowable SHA**

- At the time an entry is first added, the introducing commit SHA is not yet known.
- Therefore, `registry_entry_commit_sha` MAY be set to a placeholder, such as `"TBD..."`, in the introducing commit.

**Rule SB2: Binding via later commit**

- A subsequent commit MAY update `registry_entry_commit_sha` to the actual introducing SHA, provided:
  - No other fields in the entry are changed.
  - The update is clearly documented in the commit message.

**Rule SB3: Meaning of the field**

- `registry_entry_commit_sha` records which commit introduced the entry, not the latest commit that touched the file.

This makes the registry self-binding without violating append-only semantics.

---

## 4. Data model alignment (V0.2)

### 4.1 Witness enums

Entries MUST use the following enums:

- `witness_scope`:
  - `SELF`
  - `INDEPENDENT`
  - `AGGREGATOR`

- `witness_claim`:
  - `OBSERVED_ONLY`
  - `REPLAY_EXECUTED`
  - `ATTESTED_ELSEWHERE`

- `replay_outcome`:
  - `UNKNOWN`
  - `YELLOW_NO_BYTES`
  - `YELLOW_INCOMPLETE`
  - `GREEN_MATCH`
  - `RED_MISMATCH`

### 4.2 Registry state

- `current_registry_state`:
  - `EMPTY`
  - `ACTIVE`
  - `SEALED`

Top-level and per-entry state MUST be consistent with the operations below.

### 4.3 Supersede object

When an entry supersedes prior information, it MUST include:

```json
"supersedes": {
  "entry_index": <integer>,
  "reason": "<string>"
}
```

Rules:

- `entry_index` MUST be a valid index into `entries[]` at the time of creation.
- The superseded entry MUST NOT be edited.
- Consumers derive effective state by following supersede chains.

---

## 5. Allowed operations (V0.2)

### OP1: Append new registry entry

**Description:**
Add a new entry describing a seed, hash, witness set, or governance event.

**Preconditions:**

- `current_registry_state != "SEALED"`.
- New entry validates against V0.2 schema.
- `authority:false`, `no_fake_green:true` at top-level and entry level.

**Steps:**

1. Pull latest main.
2. Append a new entry to `entries[]`.
3. Set:
   - `schema_version = "CRP_REPLAY_REGISTRY_SCHEMA_V0_2"`.
   - `protocol_version = "CRP_REPLAY_REGISTRY_UPDATE_PROTOCOL_V0_2"`.
   - `registry_entry_created_at = <current UTC>`.
   - `registry_entry_commit_sha = "TBD..."`, or similar placeholder.
4. Set `current_registry_state`:
   - `"ACTIVE"` if previously `"EMPTY"`.
5. Validate against schema.
6. Commit with message, for example:
   - `CRP_REPLAY_REGISTRY_V0_2: append entry for <seed_hash or seed_cid>`.

### OP1b: Self-binding patch

**Description:**
Replace the placeholder `registry_entry_commit_sha` with the actual introducing commit SHA.

**Preconditions:**

- Only `registry_entry_commit_sha` is changed.
- The SHA corresponds to the commit that first introduced the entry.

**Steps:**

1. Edit the entry to replace `"TBD..."` with the actual SHA.
2. Validate against schema.
3. Commit with message, for example:
   - `CRP_REPLAY_REGISTRY_V0_2: bind entry to commit <sha>`.

This operation implements the two-commit self-binding rule.

### OP2: Supersede prior entry

**Description:**
Record updated knowledge, such as later replay, without mutating prior entries.

**Preconditions:**

- Same as OP1.
- `supersedes.entry_index` points to an existing entry.

**Steps:**

1. Append a new entry with:
   - `supersedes.entry_index = <index>`.
   - `supersedes.reason = "<reason>"`.
2. Set versioning and timestamps as in OP1.
3. Validate and commit.

The prior entry remains immutable; the new entry becomes the effective view for consumers that follow supersede chains.

### OP3: Seal registry

**Description:**
Mark V0.2 registry as closed to further entries.

**Preconditions:**

- Governance decision recorded, such as GitHub issue, signed note, or external attestation.

**Steps:**

1. Append a final entry with:
   - `current_registry_state: "SEALED"`.
   - `sealed: true`.
   - A witness object describing who observed the sealing.
2. Validate and commit, for example:
   - `CRP_REPLAY_REGISTRY_V0_2: SEALED`.

After sealing:

- OP1 and OP2 are disallowed for V0.2.
- Future changes must occur in a new artifact, such as `CRP_REPLAY_REGISTRY_V0_3`.

---

## 6. External witness evidence rules

**E1: External evidence is additive, not authoritative**

- External attestations, such as EAS, notarized logs, or GitHub signatures, MAY be referenced but do not override:
  - schema validation,
  - protocol rules,
  - append-only history.

**E2: ATTESTED_ELSEWHERE usage**

When `witness_claim: "ATTESTED_ELSEWHERE"` is used:

- The notes field SHOULD include:
  - a reference to the external system, such as EAS,
  - schema identifier, such as EAS schema UID,
  - attestation identifier, such as EAS UID, transaction hash, or URL.

**E3: GREEN_MATCH requirements**

For `replay_outcome: "GREEN_MATCH"`:

- At least one witness MUST have:
  - `witness_claim: "REPLAY_EXECUTED"`, and
  - `witness_scope: "SELF"` or `"INDEPENDENT"`.

**E4: Independent review recommendation**

- For high-value entries, at least one `INDEPENDENT` witness SHOULD review and, if applicable, add a separate entry referencing the same seed/hash.

---

## 7. Constitutional summary

Under V0.2:

- Data: `CRP_REPLAY_REGISTRY_V0_2.json`
- Validation: `CRP_REPLAY_REGISTRY_SCHEMA_V0_2.json`
- Governance: `CRP_REPLAY_REGISTRY_UPDATE_PROTOCOL_V0_2.md`

All three share:

- `authority: false`
- `no_fake_green: true`
- `append_only: true`

This protocol builds the law before exporting the witness, making any future EAS mapping a replayable extension rather than a retroactive justification.
