# PUBLIC_PROOF_PUBLICATION_CONTRACT_V1

Status: PROPOSED  
Boundary: PUBLIC_PROOF_IS_ANCHOR_NOT_AUTHORITY

## Purpose

`public-proof` publishes hash-only proof coordinates for mission lineage records.

It does not publish raw mission content, canonical mission JSON, AL acceptance JSON, or receipt JSON.

It publishes only enough information for independent parties to locate and compare hashes against the upstream record surfaces.

## Preconditions

Publication is allowed only when all of the following exist:

1. `REPLAY_RESULT.json` with verdict `REPLAY_MATCH`.
2. AL acceptance verdict `ACCEPTED`.
3. receipts-engine lineage receipt emitted under its local `outbox/`.
4. Hash equivalence across:
   - `final_sha256`
   - `replay_result_sha256`
   - `al_acceptance_sha256`
   - `receipt_sha256`

## Public Output Rule

Public-proof may publish:

- `final_sha256`
- `replay_result_sha256`
- `al_acceptance_sha256`
- `receipt_sha256`
- AL reference
- receipt reference
- publication timestamp

Public-proof must not publish:

- raw mission proposals
- canonical mission JSON
- mission semantics
- private notes
- signing keys
- wallet secrets
- claims of authority

## Authority Boundary

```text
PUBLIC_PROOF_IS_ANCHOR_NOT_AUTHORITY
```

Public-proof anchors the existence of a hash relationship.
It does not decide truth, admission, meaning, or legitimacy.

## Chain of Responsibility

```text
COMPUTERWISDOM proposes.
Canonicalizer stabilizes.
Replay reconstructs.
AL admits.
receipts-engine signs.
public-proof anchors.
```

## No Ghost Anchor Rule

A public-proof coordinate is not automatically equivalent to Anchor 001, AL acceptance, or EAS witnessing.

A coordinate becomes linked only when a specific cross-reference is committed.
