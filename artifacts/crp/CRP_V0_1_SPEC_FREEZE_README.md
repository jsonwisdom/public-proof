# CRP_V0_1_SPEC_FREEZE_README

## Status

```json
{
  "artifact": "CRP_V0_1_SPEC_FREEZE_README",
  "version": "0.1",
  "status": "SPEC_FREEZE_DECLARED",
  "execution": false,
  "certification": false,
  "authority": false
}
```

## Purpose

CRP V0.1 is a Git-backed specification stack engineered to refuse false certainty.

This README freezes the human-facing explanation of the CRP chain. It does not execute the system, certify correctness, or claim institutional authority.

Its role is archival:

- explain what CRP is
- map the specification chain
- separate specification from execution
- preserve replay discipline
- prevent fake green claims

## Core Principle

CRP does not convert claims into truth by assertion.

CRP defines a structure where claims remain provisional until they are tested against evidence, replay rules, fixtures, and deterministic validation.

```json
{
  "principle": "verification_over_narrative",
  "false_certainty_refused": true,
  "authority": false
}
```

## Track Separation

CRP V0.1 is split into two clean tracks.

### Track A — Spec Freeze

```json
{
  "track": "CRP_V0_1_SPEC_FREEZE",
  "purpose": "explain and archive the complete Git-backed specification chain",
  "claims_execution": false,
  "claims_verification": false,
  "authority": false
}
```

Track A is for humans.

It explains the constitutional structure, artifact lineage, courthouse model, observer boundaries, and validation intent.

### Track B — Validation Runner

```json
{
  "track": "CRP_VALIDATION_RUNNER_SOURCE_V0_1",
  "purpose": "turn the runner design into executable code",
  "tests_executed": false,
  "authority": false
}
```

Track B is for machines.

It will define fixtures, executable runner source, and CI workflow behavior. Until executed and externally checked, it remains source design only.

## Freeze Boundary

This artifact freezes the specification explanation only.

It does not claim:

- the runner exists
- the runner has executed
- fixtures have passed
- CI has run
- external witnesses have confirmed
- CRP has authority

## Required Next Artifacts

```json
{
  "next_artifacts": [
    "artifacts/crp/CRP_VALIDATION_FIXTURE_SET_V0_1.md",
    "artifacts/crp/CRP_VALIDATION_RUNNER_SOURCE_V0_1.md",
    "artifacts/crp/CRP_VALIDATION_CI_WORKFLOW_V0_1.md"
  ],
  "order_required": true
}
```

## Final Declaration

CRP V0.1 is frozen as a specification chain, not an execution claim.

The archive explains the system.
The runner must test the system.
Neither may pretend to be the other.

```json
{
  "spec_freeze": true,
  "runner_required": true,
  "no_fake_green": true,
  "authority": false
}
```
