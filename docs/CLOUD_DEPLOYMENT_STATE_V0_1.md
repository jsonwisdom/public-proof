# Cloud Deployment State v0.1

**Evidence source:** user-provided Google Cloud mobile-console screenshots  
**Observed date:** 2026-07-10  
**Authority:** `false`

## Observed project state

```text
PROJECT_DISPLAY_NAME = JayWisdom Boardroom
PROJECT_NUMBER = 311690651351
PROJECT_ID = UNOBSERVED
BILLING_RELATIONSHIP = OBSERVED_ACTIVE
CURRENT_MONTH_TO_DATE_COST = USD 0.02
CURRENT_MONTH_FORECAST_END_OF_MONTH_COST = USD 0.16
BUDGETS_EXCEEDED = 0_OF_1
CREDITS_AVAILABLE = USD 0.00
```

The screenshots establish the project display name and project number. They do **not** independently establish that the canonical project ID is `jaywisdom-boardroom`; that value remains planned until directly observed in project metadata or CLI output.

## Observed billing account linkage

A billing-account management screenshot shows:

```text
BILLING_ACCOUNT_PRESENT = TRUE
BILLING_ACCOUNT_ID = OBSERVED_BUT_REDACTED
BILLING_ADMIN_PRESENT = TRUE
BILLING_ADMIN_IDENTITY = OBSERVED_BUT_REDACTED
LINKED_PROJECT_DISPLAY_NAME = JayWisdom Boardroom
LINKED_PROJECT_NUMBER = 311690651351
PROJECT_LINKED_TO_BILLING_ACCOUNT = TRUE
```

The billing account identifier and billing administrator email are intentionally omitted from this public artifact. Their presence is recorded, but the raw identifiers are not republished.

## Observed billing overview

A separate billing overview screenshot uses the date range `2025-07-01` through `2026-07-31` and shows:

```text
BILLING_OVERVIEW_DATE_RANGE = 2025-07-01_TO_2026-07-31
BILLING_OVERVIEW_ACTUAL_COST = USD 0.55
BILLING_OVERVIEW_FORECAST_ADDITIONAL_COST = USD 0.14
ARTIFACT_REGISTRY_ACTUAL_COST = USD 0.34
ARTIFACT_REGISTRY_FORECAST_ADDITIONAL_COST = USD 0.09
CLOUD_KMS_ACTUAL_COST = USD 0.21
CLOUD_KMS_FORECAST_ADDITIONAL_COST = USD 0.04
CLOUD_BUILD_ACTUAL_COST = USD 0.00
CLOUD_BUILD_FORECAST_ADDITIONAL_COST = USD 0.00
```

The `$0.55` overview value and `$0.02` month-to-date value come from different billing views and time windows. They must not be treated as contradictory or interchangeable.

## Observed resources

```text
COMPUTE_VM_INSTANCES = NONE_OBSERVED
COMPUTE_DISKS = NONE_OBSERVED
COMPUTE_SNAPSHOTS = NONE_OBSERVED
KUBERNETES_CLUSTERS = NONE_OBSERVED
KUBERNETES_WORKLOADS = NONE_OBSERVED
KUBERNETES_SERVICES = NONE_OBSERVED
CLOUD_SQL_INSTANCES = NONE_OBSERVED
STORAGE_BUCKET_COUNT = 1
APP_ENGINE_AVAILABILITY = NOT_AVAILABLE_IN_CURRENT_PROJECT_VIEW
ZONE_LISTING = PERMISSION_DENIED_IN_MOBILE_VIEW
```

These observations are limited to the surfaces visible in the supplied screenshots. They are not a complete project inventory.

## Observed IAM posture

The supplied screenshots show:

- one human principal with the `Owner` role;
- a default Compute Engine service account with the `Editor` role;
- a Cloud Build service account with `cloudbuild.builds.builder`;
- multiple Google-managed service agents for Artifact Registry, Cloud AI Companion, Cloud Build, Pub/Sub, Cloud Run, Container Registry, and related services.

Human email addresses and full principal identifiers are intentionally omitted from this public artifact.

```text
OWNER_ROLE_PRESENT = TRUE
DEFAULT_COMPUTE_EDITOR_ROLE_PRESENT = TRUE
CLOUD_BUILD_BUILDER_PRESENT = TRUE
GOOGLE_MANAGED_SERVICE_AGENTS_PRESENT = TRUE
WIF_POOL = NOT_OBSERVED
WIF_PROVIDER = NOT_OBSERVED
FIREBASE_DEPLOYER_SERVICE_ACCOUNTS = NOT_OBSERVED
FIREBASE_HOSTING_SITE = NOT_OBSERVED
```

## Deployment coordinates

```text
PLANNED_PRODUCTION_PROJECT_ID = jaywisdom-boardroom
PLANNED_PREVIEW_PROJECT_ID = jaywisdom-boardroom-preview
PLANNED_PRODUCTION_SITE_ID = jaywisdom-boardroom
PLANNED_PREVIEW_SITE_ID = jaywisdom-boardroom-preview
FIREBASE_DEPLOYMENT_ENABLED = FALSE
LIVE_URL = UNOBSERVED
PREVIEW_URL = UNOBSERVED
```

The planned identifiers above are configuration intent, not proof of existing Firebase or Google Cloud resources.

## Merge boundary

The architecture may be reviewed and merged while inert because both Firebase workflows remain gated by:

```text
FIREBASE_DEPLOYMENT_ENABLED == true
```

Before any deployment is enabled, the following must be independently observed and receipted:

1. exact production project ID;
2. exact preview project ID;
3. Firebase project linkage for each environment;
4. Hosting site IDs;
5. Workload Identity pools and providers;
6. deployment service accounts;
7. IAM bindings;
8. GitHub repository variables;
9. protected production environment approval settings.

## Invariants

```text
CONFIGURATION_INTENT != OBSERVED_CLOUD_STATE
PROJECT_DISPLAY_NAME != PROJECT_ID
BILLING_ACCOUNT_PRESENT != PUBLICATION_REQUIRED
BILLING_VIEW_TOTAL != CURRENT_MONTH_TOTAL
PRINCIPAL_LISTING != WALLET_CONTROL
NO_FAKE_GREEN = TRUE
NO_FAKE_RED = TRUE
AUTHORITY = FALSE
```
