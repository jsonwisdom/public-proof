# CRP Witness #002 Merge Event Replay Checklist (V0.1)

Symbolic checklist only. This file is not evidence, not a merge claim, and not a green.

## Purpose

This checklist gives future reviewers and agents a deterministic path for inspecting PR #3 if a merge event occurs.

It does not assert that PR #3 has merged.

It does not admit Witness #002.

## Source PR

- Repository: `jsonwisdom/public-proof`
- PR Number: `3`
- PR Title: `CRP Witness #002 Workflow Merge Receipt v0.1`
- Source Branch: `crp-witness-002-merge-receipt`
- Target Branch: `main`
- Current Review Head At Checklist Creation: `e433e8fb1ba071ac152778723d329cd10ecc058b`

## Pre-Merge Review Checks

- Confirm PR #3 is open.
- Confirm PR #3 is mergeable.
- Confirm the PR has no deletions unless separately explained.
- Confirm all changed files are symbolic documentation or templates.
- Confirm no file claims Witness #002 admission by merge alone.
- Confirm no file implies green without replay.
- Confirm authority remains false.

## Merge Event Checks

Perform only if a merge action occurs.

```json
{
  "pr": 3,
  "merged": null,
  "merged_at": null,
  "merge_commit_sha": null,
  "merge_method": null,
  "expected_head_sha_at_merge": null,
  "operator": null
}
```

## Post-Merge Main Branch Checks

Perform only after GitHub reports `merged: true`.

- Fetch latest `main`.
- Record `main` HEAD after merge.
- Confirm the merge commit is reachable from `main`.
- Confirm expected files exist on `main`.
- Confirm file contents match the PR diff or documented merge result.
- Confirm no unexpected authority or green language was introduced.

## Expected Files After Merge

```text
artifacts/crp/CRP_WITNESS_002_WORKFLOW_MERGE_RECEIPT_V0_1.md
docs/public/HOW_TO_READ_A_GITHUB_WORK_TRAIL_V0_1.md
artifacts/crp/MERGE_RECEIPT_TEMPLATE_V0_1.md
artifacts/crp/POST_MERGE_RECEIPT_TEMPLATE_V0_1.md
artifacts/crp/MERGE_EVENT_REPLAY_CHECKLIST_V0_1.md
```

## Replay Boundary

Merge inspection is not witness admission.

Witness #002 remains unadmitted unless a separate replay process verifies the required evidence and records an explicit admission artifact.

## Final Gate

A future post-merge receipt may be populated only when:

- GitHub merge metadata is captured.
- Main branch file presence is confirmed.
- Review boundaries are preserved.
- Evidence lane remains separate.
- Authority remains false.
- No green is implied without replay.

## Constitutional Posture

```json
{
  "authority": false,
  "green_implied": false,
  "witness_002_admitted": false,
  "merge_claimed": false,
  "trail_type": "merge_event_replay_checklist",
  "membrane": "clean"
}
```
