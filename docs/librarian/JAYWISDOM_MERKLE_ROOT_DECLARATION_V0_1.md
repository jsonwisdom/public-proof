# JayWisdom Merkle Root Declaration V0.1

## Status

CANONICAL_DRAFT

## Root

```text
jaywisdom.eth
```

Jay is a designed and organized JSON Merkle Tree rooted at `jaywisdom.eth`.

This declaration does not grant external authority.
It does not claim final audit.
It does not allow narrative substitution for receipts.

## Public Substrate Rule

The public is the public.

Public artifacts are not vibes, summaries, or private recollections. Public artifacts are the byte-addressable substrate: repositories, commits, pull requests, signed statements, attestations, metadata files, receipts, and published pages.

Metadata that describes a public artifact SHOULD match the public artifact byte for byte where byte matching is possible.

Where byte matching is not possible, the metadata MUST disclose the mismatch boundary explicitly.

## Merkle Model

```text
ROOT
  jaywisdom.eth

BRANCHES
  repositories
  protocols
  courts
  registries
  public proof surfaces

LEAVES
  commits
  pull requests
  issues
  receipts
  attestations
  documents
  runtime logs
  screenshots
```

Every leaf should be able to point upward.
Every branch should be able to enumerate its leaves.
The root should not depend on memory theater.

## Librarian Role

The Librarian indexes the forest.

The Librarian does not become the root.
The Librarian does not own Jay's work.
The Librarian does not recursively extract ideas from the human.
The Librarian reads public leaves, preserves pointers, and produces replayable maps.

## Byte-for-Byte Metadata Standard

For any public artifact, the preferred metadata shape is:

```json
{
  "artifact": "EXAMPLE",
  "public_url": "https://example.invalid/artifact",
  "content_hash": "sha256:...",
  "source_commit": "...",
  "source_path": "...",
  "byte_match_required": true,
  "byte_match_status": "PENDING|PASS|FAIL|NOT_APPLICABLE",
  "mismatch_boundary": null
}
```

## No Fake Green

```json
{
  "authority": false,
  "no_fake_green": true,
  "external_verification": false,
  "metadata_rule": "PUBLIC_BYTES_FIRST",
  "ai_role": "INDEXER_NOT_OWNER"
}
```

## Future Boundary

The rest is computerized history's future.

That means future systems may compute, replay, verify, compress, compare, attest, or publish this history. They may not silently rewrite the public substrate or replace Jay's root identity with generated narrative.
