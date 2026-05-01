# Anchor 001 — Canonical Reference

## Status

This repo, `public-proof`, stores coordinate-based proof artifacts using its own hash pipeline.

The canonical Anchor 001 for the receipts-machine ecosystem is in `jsonwisdom/Welcome-to-JSONWISDOM`.

## Canonical Anchor 001

| Field | Value |
|---|---|
| Source Repo | `jsonwisdom/Welcome-to-JSONWISDOM` |
| Git Commit | `13004719dd0c34f765ca95dfe8566b6feb2bf6cf` |
| Merkle Root (SHA-256) | `ff55160908ff41d23f7af0df8873ef7a0dcf8163d1a308f58941e87b5a95bad9` |
| Leaf Keccak-256 | `0xb7e55f9e1f4f27cd96f38d74e6510e184a14772ef3f9f628d5acc68531dd185d` |
| EAS Schema UID | `0x3bab210b4da3faff084e146075caf9168efb5c9c87f18509bca2c07d7f2e49c` |
| EAS Attestation UID | `0x18b5b00c62c648df2ccf4a746645493fa2a0b0dcda6697052d8c3a3d1586c142` |
| Chain | Base |
| Canonicalization | RFC 8785 JCS |
| ENS | `DEFERRED` |

## Relationship to public-proof

`public-proof` coordinate hashes are independent artifacts.

They are not Anchor 001.

To verify Anchor 001, use the canonical source above.

To verify a `public-proof` coordinate, use this repo's own coordinate hash pipeline and workflows.

## Boundary Rule

Coordinate numbers such as `001`, `002`, `004`, or `005` in this repo must not be treated as equivalent to Anchor 001 unless a specific cross-reference is committed.

Rule: no ghost anchor.
