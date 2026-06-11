# CRP Witness #002 Post-Merge Receipt — Template (V0.1)

Symbolic scaffold only. This file is not evidence, not a merge claim, and not a green.

## Purpose

This template records the structure of a post-merge receipt if PR #3 is eventually merged into `main` and then inspected after merge.

It does not assert that the merge occurred.

It does not assert that post-merge replay passed.

## Source PR

- Repository: `jsonwisdom/public-proof`
- PR Number: `3`
- PR Title: `CRP Witness #002 Workflow Merge Receipt v0.1`
- Source Branch: `crp-witness-002-merge-receipt`
- Target Branch: `main`
- Current Review Head: `2559f07341e5a4f034bfd7bc30253fc8473a1e79`

## Preconditions Before This Template Can Be Populated

- PR #3 is merged.
- GitHub reports `merged: true`.
- `merged_at` is present.
- Final merge commit SHA is captured.
- Main branch contains the expected files.
- Post-merge inspection is performed independently.

## Expected Files To Confirm After Merge

```text
artifacts/crp/CRP_WITNESS_002_WORKFLOW_MERGE_RECEIPT_V0_1.md
docs/public/HOW_TO_READ_A_GITHUB_WORK_TRAIL_V0_1.md
artifacts/crp/MERGE_RECEIPT_TEMPLATE_V0_1.md
artifacts/crp/POST_MERGE_RECEIPT_TEMPLATE_V0_1.md
```

## Forward Fields To Fill Only After Merge

```json
{
  "merged": null,
  "merged_at": null,
  "merge_commit_sha": null,
  "main_head_after_merge": null,
  "operator": null,
  "merge_method": null,
  "post_merge_files_confirmed": null,
  "post_merge_replay_performed": false,
  "witness_002_admitted": false,
  "authority": false,
  "green_implied": false
}
```

## Post-Merge Replay Checklist

- Confirm PR #3 reports `merged: true`.
- Confirm merge commit SHA.
- Fetch `main` after merge.
- Confirm expected files exist on `main`.
- Confirm no file claims Witness #002 admission by merge alone.
- Confirm authority remains false.
- Confirm no fake green language is introduced.
- Record any replay hash checks separately.

## Membrane Posture

- Symbolic lane: `ACTIVE`
- Evidence lane: `SEPARATE`
- Authority: `false`
- Green: `not implied`
- Witness #002 Admission: `false unless separately admitted by replay evidence`

## Notes

This template becomes a post-merge receipt only when populated with verified GitHub merge metadata and post-merge inspection results.

Until then, it remains a future-facing scaffold.
