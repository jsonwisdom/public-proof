# EXTERNAL_REPLAY_GREEN_RECEIPT

## Status

`EXTERNAL_REPLAY_GREEN_ISSUED`

## Scope

Technical reproducibility only.

This receipt records an external GitHub Actions replay witness. It does not assert semantic truth, institutional authority, or any authority-bearing claim beyond the mechanical replay properties listed here.

## Witness

- Witness repository: `jsonwisdom/AL`
- Target repository: `jsonwisdom/public-proof`
- Target commit: `26d255899241a3f5cdfcb6d3b3be7333e380fae8`
- Workflow run ID: `27386089192`
- Workflow job ID: `80933304118`
- Workflow SHA: `d274716a4c5251e324b6524870eb8402c24c17cb`
- Artifact ID: `7580104955`

## Hashes

- Inventory SHA-256: `3cdd931bdeb5cad4c498421f1a3cfcc6c9de2d0713cec6d7f55e8f3abb7ea4a7`
- Artifact ZIP SHA-256: `8e67bda7da4f0684ab6ceaad2c23f19c31fe3bc29c74562697cb828e0420d78b`

## Verified Properties

- clone_fidelity
- inventory_integrity
- commit_pinning
- fsck_cleanliness
- working_tree_purity

## Observed Results

- `git status`: CLEAN
- `sha256sum -c repo_inventory.sha256`: ALL_OK
- `git fsck --full`: NO_OUTPUT_NO_ERRORS
- `garbage`: 0
- `EXTERNAL_REPLAY_STDOUT_COMPLETE`: true

## Claims Excluded

- authority: false
- semantic_truth_claims: false
- institutional_claims: false
- green_implied: false

## Directives

- PROTECT_OUR_ASSETS
- DENY_OUTSIDE_INFLUENCE

## Canonical Verdict

`EXTERNAL_REPLAY_GREEN_ISSUED`
