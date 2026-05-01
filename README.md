# public-proof

> **Status: Coordinate-Based Public Proof Storage**
>
> This repo stores coordinate-based proof artifacts using its own hash pipeline.
> For the canonical Anchor 001 path — RFC 8785 JCS → SHA-256 → Keccak-256 → EAS on Base — use `jsonwisdom/Welcome-to-JSONWISDOM`.
>
> See `docs/ANCHOR_001_CANONICAL_REFERENCE.md` for the current Anchor 001 boundary.

## Boundary

`public-proof` coordinates are independent proof artifacts.

They are not automatically equivalent to Anchor 001.

Coordinate numbers such as `001`, `002`, `004`, or `005` must not be treated as Anchor 001 unless a specific cross-reference is committed.

Rule: no ghost anchor.
