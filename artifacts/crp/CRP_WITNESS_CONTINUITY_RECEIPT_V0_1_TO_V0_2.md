# CRP_WITNESS_CONTINUITY_RECEIPT_V0_1_TO_V0_2

## Purpose

This receipt records the lawful continuity transition from the missing V0.1 witness manifest expectation to the active V0.2 witness registry lineage.
It does not silently substitute files. It does not claim authority. It does not create fake green.

## Continuity Finding

Missing expected artifact: artifacts/crp/WITNESS_MANIFEST_V0_1.json

Present V0.2 successor witness artifacts:
- artifacts/crp/crp-seed-002-the-second-witness.accepted.json
- artifacts/crp/crp-seed-002-the-second-witness.txt
- artifacts/crp/CRP_REPLAY_REGISTRY_V0_2.json

## Observed Hashes

accepted_manifest_sha256: 4bc41dfc52a07658db153474c1b4bd508c11162a05f03443f3198012f4b72047
seed_text_sha256: 5ab3d2bfc864710f48188fd1f89ebe3d76304a15ed414c0a8e058d0b0b0e4108
registry_v0_2_sha256: 2c87c699325e1b16e1d3ab148a3f4f85f7138cb1b41ddc5d0cf000de2166b9b2

## Continuity Ruling

The V0.1 witness manifest is missing.
The V0.2 registry and seed-002 witness artifacts are recognized as the active successor witness lineage.
This receipt binds the transition explicitly and prevents silent substitution.

## Constitutional Invariants

authority: false
no_fake_green: true
silent_substitution: false
v0_1_manifest_missing: true
v0_2_successor_lineage_present: true
witness_002_open_allowed: false
