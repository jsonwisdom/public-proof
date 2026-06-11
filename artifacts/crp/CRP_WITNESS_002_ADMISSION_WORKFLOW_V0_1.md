# CRP Witness #002 Admission Workflow V0.1

## Purpose

This artifact defines the deterministic admission workflow for Witness #002.

It records that Witness #002 may be admitted only after the continuity gate, evidence integrity checks, manifest linkage checks, and replay registry binding all pass.

This artifact claims no authority.

## Evidence Inputs

Repository:

- jsonwisdom/public-proof

Continuity commit:

- 5d553c010f170db18256f91f0b0219369e3349f3

Continuity receipt:

- artifacts/crp/CRP_WITNESS_CONTINUITY_RECEIPT_V0_1_TO_V0_2.md

Witness #002 manifest:

- artifacts/crp/crp-seed-002-the-second-witness.accepted.json
- sha256: 4bc41dfc52a07658db153474c1b4bd508c11162a05f03443f3198012f4b72047

Witness #002 seed text:

- artifacts/crp/crp-seed-002-the-second-witness.txt
- sha256: 5ab3d2bfc864710f48188fd1f89ebe3d76304a15ed414c0a8e058d0b0b0e4108

Replay registry:

- artifacts/crp/CRP_REPLAY_REGISTRY_V0_2.json
- sha256: 2c87c699325e1b16e1d3ab148a3f4f85f7138cb1b41ddc5d0cf000de2166b9b2

## Continuity Gate

The continuity gate is OPEN only if:

1. The repository lineage contains commit 5d553c010f170db18256f91f0b0219369e3349f3.
2. The continuity receipt exists at artifacts/crp/CRP_WITNESS_CONTINUITY_RECEIPT_V0_1_TO_V0_2.md.
3. The receipt explicitly records the missing V0.1 witness manifest and the V0.2 successor witness lineage.
4. The receipt preserves authority:false, no_fake_green:true, and silent_substitution:false.

Gate OPEN does not equal witness admission.

## Witness Admission Checks

Witness #002 admission requires:

1. The accepted manifest exists.
2. The accepted manifest sha256 matches:
   4bc41dfc52a07658db153474c1b4bd508c11162a05f03443f3198012f4b72047
3. The manifest id equals:
   crp-seed-002-the-second-witness
4. The manifest content_uri equals:
   artifacts/crp/crp-seed-002-the-second-witness.txt
5. The seed text exists.
6. The seed text sha256 matches:
   5ab3d2bfc864710f48188fd1f89ebe3d76304a15ed414c0a8e058d0b0b0e4108

## Replay Registry Binding

Replay registry binding requires:

1. CRP_REPLAY_REGISTRY_V0_2.json exists.
2. Its sha256 matches:
   2c87c699325e1b16e1d3ab148a3f4f85f7138cb1b41ddc5d0cf000de2166b9b2
3. The registry contains entry:
   crp-seed-002-the-second-witness-external-replay-001
4. The entry subject_entry_id equals:
   crp-seed-002-the-second-witness
5. The entry subject_sha256 equals:
   5ab3d2bfc864710f48188fd1f89ebe3d76304a15ed414c0a8e058d0b0b0e4108
6. The entry replay_outcome equals:
   GREEN_MATCH
7. The entry preserves authority:false and no_fake_green:true.

## Admission Ruling

Witness #002 is ADMITTED only if:

- continuity gate is OPEN
- manifest checks PASS
- seed text checks PASS
- replay registry binding is BOUND

If any condition fails, Witness #002 is NOT_ADMITTED.

## Mutation Permissions

Admission-related mutation is allowed only after registry binding is BOUND.

Any future change to admission logic must be introduced as a new versioned artifact and must not rewrite this V0.1 ruling.

## Failure States

- CONTINUITY_GATE_CLOSED
- MANIFEST_MISSING
- MANIFEST_HASH_MISMATCH
- SEED_TEXT_MISSING
- SEED_TEXT_HASH_MISMATCH
- MANIFEST_SEED_LINK_BROKEN
- REGISTRY_MISSING
- REGISTRY_HASH_MISMATCH
- REPLAY_WITNESS_MISSING
- REPLAY_OUTCOME_NOT_GREEN_MATCH
- AUTHORITY_CLAIM_DETECTED
- FAKE_GREEN_DETECTED

## Constitutional Invariants

authority: false

no_fake_green: true

silent_substitution: false

gate_open_is_not_admission: true

admission_requires_manifest_seed_registry_and_replay: true

registry_binding_precedes_mutation: true
