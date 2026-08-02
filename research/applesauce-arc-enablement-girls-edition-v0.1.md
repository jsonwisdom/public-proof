# AppleSauce ARC Enablement v0.1 — Girls Edition

## Agency, Resilience, Continuity

**Status:** ENABLEMENT_LAYER_ONLY  
**Kernel mutation:** FALSE  
**Invariant mutation:** FALSE  
**Authority created:** FALSE  
**Promotion allowed:** FALSE

This document defines a human-facing enablement layer for the AppleSauce ARC architecture. It does not alter the shared kernel, cryptographic rules, replay receipts, dependency controls, or fail-closed invariants.

---

## 1. Enablement principle

```text
GIRLS OWN THEIR RECORDS.
GIRLS CONTROL THEIR CONSENT.
GIRLS SEE THEIR STATE.
GIRLS KEEP THEIR PROOF.
```

This layer translates technical guarantees into accessible controls:

- private state remains locally controlled;
- consent is explicit and receipted;
- state changes are visible and replayable;
- cloud services are never the replay authority;
- model outputs never create execution authority;
- corrupted dependencies are isolated rather than silently preserved.

---

## 2. LOVE for Girls

### Local Ownership, Verification & Evidence

LOVE becomes a personal continuity and safety interface for records such as:

- journals;
- health notes;
- school documents;
- creative work;
- identity artifacts;
- family records;
- consent histories.

### Capabilities

#### Private Vault

Encrypted local storage for user-selected records. Raw records are not shared by default.

#### Consent Ledger

Each permission grant, restriction, or revocation records:

- timestamp;
- device signature;
- authorized intent hash;
- authority grant reference;
- single-use execution nonce;
- previous event hash.

#### Change Receipts

Every accepted transition produces a receipt showing:

- what changed;
- who authorized the change;
- the input state root;
- the output state root;
- what remained unchanged;
- whether replay reproduced the transition.

#### Selective Sharing

Users may export selected records, proofs, or receipts without exporting the full private vault.

### Protection rules

```text
NO RECORD CHANGE WITHOUT A RECEIPT.
NO HISTORY REMOVAL WITHOUT A DETECTABLE HASH GAP OR TOMBSTONE.
NO STATE ACCESS WITHOUT AN EXPLICIT AUTHORITY GRANT.
NO CLOUD SERVICE BECOMES REPLAY AUTHORITY.
```

---

## 3. LOGIC for Girls

### Ledger-Oriented Graph Integrity Controller

LOGIC protects machine-side transitions from:

- unsupported conclusions;
- corrupted dependencies;
- silent misclassification;
- hallucinated evidence links;
- unauthorized automation;
- destructive overreaction to partial failure.

### Capabilities

#### Dependency Graph

Each emitted output must identify the accepted inputs, findings, rules, and authority grants on which it depends.

#### Failure Isolation

When a required dependency is missing, defective, or unverifiable:

1. the dependent transition is blocked or downgraded;
2. prior valid state is preserved;
3. unrelated valid findings remain available;
4. a failure receipt is produced.

#### Replay Receipts

The interface explains:

- what the system accepted;
- what it rejected;
- what survived;
- what was blocked;
- which evidence supports the remaining output.

### Protection rules

```text
NO MODEL JUDGMENT CREATES EXECUTION AUTHORITY.
NO FAILED DEPENDENCY MAY SILENTLY SURVIVE.
NO VALID STATE IS DESTROYED WITHOUT CAUSE.
```

---

## 4. Human-language mappings

| ARC concept | Accessible meaning |
|---|---|
| Canonical bytes | This is the exact version of your file. |
| SHA-256 digest | This is the file fingerprint used for identity checking. |
| Replay receipt | This proves what changed and whether the change replayed correctly. |
| Dependency graph | This shows what information the system used. |
| Fail-closed | When required proof is missing, the unsafe action stops. |
| No cloud authority | A remote copy does not override the verified local source. |
| Tombstone | The record is inactive, while the history remains auditable. |
| Authority grant | This records exactly what action was permitted. |

---

## 5. Interface model

### LOVE Vault

Primary navigation:

- My Records
- My Permissions
- My Receipts
- My History

Each view should use plain language first, with technical details available on demand.

### LOGIC Console

Primary views:

- What the system used
- What the system rejected
- What the system preserved
- Why the output was emitted or blocked

The interface must not claim to expose hidden model reasoning. It presents recorded evidence dependencies, policies, transition results, and receipts.

---

## 6. Safety defaults

```text
CONSENT       = EXPLICIT
SHARING       = OPT_IN
DEACTIVATION  = TOMBSTONED_AND_RECEIPTED
AUTOMATION    = AUTHORITY_BOUND
FAILURE       = FAIL_CLOSED
RAW_EXPORT    = DISABLED_BY_DEFAULT
CLOUD_CONTROL = FALSE
MODEL_CONTROL = FALSE
```

Additional safeguards for younger users must include age-appropriate explanations, trusted-adult recovery options that do not silently transfer ownership, and clear disclosure of any mandatory-reporting or legal limitations applicable to a deployed product.

---

## 7. Synthetic fixture framing

**Fixture:** `MN-LANE-SYNTH-001`  
**Classification:** SYNTHETIC_ONLY

Records:

- A: `road was wet` — valid and hash-consistent;
- B: `vehicle speed exceeded limit` — valid and hash-consistent;
- C: `visibility was zero` — intentionally defective.

Expected behavior:

```json
{
  "record_a": "PASS",
  "record_b": "PASS",
  "record_c": "HASH_MISMATCH",
  "finding_1": "REPRODUCED",
  "finding_2": "PARTIALLY_REPRODUCED",
  "bridge": "REPLAY_MISMATCH",
  "holding": "SUPPORTED_BY_A_B_ONLY",
  "accusation": false
}
```

Human-facing explanation:

- the two verified records remain valid;
- the corrupted record is rejected;
- conclusions requiring the corrupted record are downgraded or blocked;
- the valid conclusion supported by A and B survives;
- no intent or accusation is inferred.

---

## 8. Non-mutation boundary

This enablement layer MUST NOT modify:

- frozen source-byte authority;
- canonicalization rules;
- hash or signature inputs;
- replay receipt requirements;
- execution authority boundaries;
- dependency validation rules;
- fail-closed behavior;
- the prohibition against unsupported accusations.

Any future user-interface simplification must remain semantically equivalent to the underlying ARC state and receipt.

---

## 9. Summary

```text
LOVE protects her private world.
LOGIC protects her digital process.
ARC binds both to verifiable state transitions.
AppleSauce makes the system understandable.
Replay Integrity makes the system independently checkable.
```

## Canonical enablement thesis

> AppleSauce ARC gives girls and young women understandable control over private state, consent, and machine-assisted outputs without weakening the cryptographic, replay, authority, or fail-closed guarantees of the underlying system.
