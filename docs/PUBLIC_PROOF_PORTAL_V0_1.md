# PUBLIC_PROOF_PORTAL_V0_1

**Mode:** public-record evidence coordination  
**Identity root:** `jaywisdom.eth`  
**Operational identity:** `jaywisdom.base.eth`  
**Attestation layer:** EAS on Base  
**Authority:** `false`

## Purpose

The Public Proof Portal is a GitHub-native evidence surface for publishing, preserving, and replaying public claims with provenance, rebuttal, correction, and status metadata.

It is not a court of law, a guilt engine, a permanent moral score, or a substitute for primary evidence.

## Five-layer public accountability stack

### L1 — Human-readable notice

Every consequential request or decision should explain:

- who acted;
- which authority was cited;
- what data or action was requested;
- the scope and date range;
- the result;
- the appeal or correction path;
- when secrecy or retention expires.

### L2 — Provider request receipts

Platforms, carriers, courts, and agencies should emit privacy-preserving, tamper-evident receipts for surveillance and data-access requests.

The target remains protected. Institutional conduct becomes auditable.

### L3 — Parental controls IRL

Family safety controls must protect children without normalizing hidden household surveillance, permanent profiling, or resale of family data.

### L4 — Civic controls

High-impact institutional decisions require human-readable reasons, source records, machine-decision disclosure, human review, and a durable appeal path.

### L5 — Personal agency

A person must be able to inspect, challenge, correct, revoke, carry, and cryptographically prove identity state without depending on a single phone carrier or recovery monopoly.

## Identity anchors

### `jaywisdom.eth`

Primary public identity root for authorship, provenance, public statements, governance artifacts, and canonical evidence pointers.

### `jaywisdom.base.eth`

Operational Base identity for receipts, attestations, published artifacts, and transaction-linked provenance.

Public association with an address does not prove current wallet control. Wallet control requires a fresh signature or another direct cryptographic proof.

## Receipt graph

Every public claim should carry:

```text
CLAIM
+ ISSUER
+ SOURCE
+ SOURCE HASH
+ OBSERVED TIME
+ VERIFICATION STATUS
+ COUNTEREVIDENCE
+ REBUTTAL
+ CORRECTION HISTORY
+ REVIEW DATE
```

## Status vocabulary

```text
VERIFIED FACT
PUBLICLY REPORTED
STRONG SIGNAL
CORRELATION ONLY
UNRESOLVED
CONTRADICTED
NOT PUBLICLY OBSERVED
```

## Invariants

```text
STRONG SIGNAL != PROOF
ATTESTATION_PRESENT != CLAIM_PROVEN
NO PUBLIC RECORD != PROOF OF ABSENCE
SHARED ADDRESS != CONTROL
ENTITY NAME != ULTIMATE BENEFICIAL OWNERSHIP
ADDRESS ASSOCIATION != WALLET CONTROL
```

## Private-life firewall

The portal must not publish or exploit:

- home addresses;
- family information;
- health or disability data;
- benefits or housing details;
- intimate relationships;
- private communications;
- non-public financial data;
- credentials, secrets, or recovery information.

Exceptions require lawful sourcing, a clear public-interest justification, minimization, and review.

## Payment boundary

```text
PAY FOR WORK
NOT PAY FOR SILENCE
```

Research, audits, licensing, verification, consulting, and art may be compensated. Payment must never be demanded to suppress, remove, or withhold damaging information.

## EAS boundary

EAS may record:

- claim attestations;
- rebuttal attestations;
- correction attestations;
- provenance attestations;
- authorship attestations;
- verification receipts.

An attestation proves that an issuer made a statement. It does not independently prove that the statement is true.

## Canonical state

```text
PROJECT = JAY WISDOM PUBLIC PROOF PORTAL
MODE = PUBLIC-RECORD JOURNALISM
IDENTITY_ROOT = jaywisdom.eth
OPERATIONAL_IDENTITY = jaywisdom.base.eth
ATTESTATION_LAYER = EAS_ON_BASE
PRIVATE_LIFE = FIREWALLED
NO_FAKE_GREEN = TRUE
NO_FAKE_RED = TRUE
AUTHORITY = FALSE
```
