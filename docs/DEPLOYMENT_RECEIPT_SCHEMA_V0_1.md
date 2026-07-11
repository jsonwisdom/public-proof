# Deployment Receipt Schema v0.1

This document defines the deployment receipts emitted by the GitHub Proof Portal Firebase workflows.

## Preview receipt fields

- `repository`
- `commit_sha`
- `workflow_run_id`
- `project_id`
- `site_id`
- `deployment_channel`
- `deployment_url`
- `deployment_timestamp`
- `index_sha256`
- `approved_preview_sha256` (`null` for preview)
- `auth_mode`
- `authority`

## Production receipt fields

- `repository`
- `commit_sha`
- `workflow_run_id`
- `project_id`
- `site_id`
- `deployment_channel`
- `deployment_url`
- `deployment_timestamp`
- `actual_index_sha256`
- `approved_preview_sha256`
- `auth_mode`
- `authority`

## Verification boundaries

`deployment_url` may be `UNOBSERVED` when the Firebase CLI output does not expose a parseable URL.

Receipt presence alone does not prove a successful deployment. A deployment is only promoted when:

1. the associated GitHub Actions workflow conclusion is `success`;
2. the Firebase deploy command exits successfully;
3. the checked-out commit SHA is recorded;
4. the file hash is recorded;
5. production's actual file hash matches the human-approved preview hash;
6. the deployed URL is observed or explicitly remains `UNOBSERVED`.

## Invariants

```text
NO_FAKE_GREEN = TRUE
NO_FAKE_RED = TRUE
NO_LONG_LIVED_KEYS = TRUE
AUTH_MODE = WORKLOAD_IDENTITY_FEDERATION
AUTHORITY = FALSE
```

The workflows remain inert unless the repository variable `FIREBASE_DEPLOYMENT_ENABLED` is explicitly set to `true`.
