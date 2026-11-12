# Garbage Press / CI-FIRST — Presidential Model One

**2026-11-12 · FICTIONAL CONCEPT · NOT AN OFFICIAL NVIDIA PRODUCT · NO PRESIDENTIAL ENDORSEMENT**

This directory is a **public receipt layer** for a privately held full-resolution AI-generated satirical cover. It is **not** a publicly independently verifiable full-resolution image archive. The quote "EVERY PRESIDENT WANTS ONE" is fictional satire, not evidence of an order, endorsement, or direct quotation.

![Public low-resolution preview](preview_192x77.jpg)

## Public receipt and evidence boundary

- **PASS:** GitHub commit contains the manifest, README, preview, and separate SHA-256 checksum files.
- **PASS (commitment only):** Original PNG digest published in `ORIGINAL_SHA256SUMS.txt`.
- **PASS:** A lossy **192 × 77 JPEG preview** is committed and can be checked with `SHA256SUMS.txt`.
- **FAIL / NOT DONE:** Original **1983 × 793 PNG bytes** are **not** committed, so their digest **cannot** be independently recalculated from this repository.
- **UNKNOWN:** Independent original-creation provenance, authorship/date verification; actual presidential endorsement/order.
- **FICTION:** "NVIDIA Presidential Model One" as an official product and any endorsement depicted in the image.

## Reproduce what is publicly verifiable now

From the root of this repository:

```bash
cd artifacts/garbage-press/presidential-model-one/2026-11-12
sha256sum -c SHA256SUMS.txt
```

`SHA256SUMS.txt` now checks **only the publicly committed preview**. Its PASS cannot establish the original PNG's integrity.

## Original PNG verification — only after obtaining the actual PNG

Place the original PNG next to the checksums file, then run:

```bash
sha256sum -c ORIGINAL_SHA256SUMS.txt
```

Expected original PNG SHA-256:

```text
84454871ede6e3dbe5960cee3a685307399a5ae379ce0c865c4476dfdfaea506
```

If the file is missing, this check **fails** (NOT DONE), rather than returning a misleading preview-only PASS. File hashing is not proof of authorship, creation date, or a real NVIDIA product.

## GitHub provenance

Initial public receipt commit (full SHA): [c1821eb6a4ddd9ae77d17389be71e78254cbb61a](https://github.com/jsonwisdom/public-proof/commit/c1821eb6a4ddd9ae77d17389be71e78254cbb61a).

The current revision commit is identified by the GitHub containing-commit URL, not a self-referential SHA embedded in this file.

**Do not merge** this evidence file with the separately generated China Edition 6090 illustration. No NVIDIA affiliation, blockchain notarization, presidential authorization, or third-party archival timestamp is claimed.

**JOY FIRST. KEEP THE RECEIPTS. ❤️**
