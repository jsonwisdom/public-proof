# CRP V0.1 Compatibility Note

**Status:** Archived reference — not active governance surface  
**Date:** 2026-06-11  
**Authority:** false  
**No fake green:** true  

## Declaration

- V0.1 remains historically valid as a **replay lineage artifact**.
- V0.1 is **not** the active governance surface.
- **V0.2 supersedes V0.1** for:
  - Registry operations
  - Witness enums (`witness_scope`, `witness_claim`)
  - Seal mechanics (`sealed: true`, `supersedes`)
  - Self-binding (two-commit pattern, replay outcome serialization)
- No V0.1 artifact is **deleted** or **rewritten**.

## Relationship to V0.2 Triad

| Layer | V0.1 | V0.2 |
|-------|------|------|
| Schema | `CRP_REPLAY_REGISTRY_SCHEMA_V0_1` | `CRP_REPLAY_REGISTRY_SCHEMA_V0_2` |
| Registry | `CRP_REPLAY_REGISTRY_V0_1.json` | `CRP_REPLAY_REGISTRY_V0_2.json` |
| Protocol | `CRP_REPLAY_REGISTRY_UPDATE_PROTOCOL_V0_1.md` | `CRP_REPLAY_REGISTRY_UPDATE_PROTOCOL_V0_2.md` |

## Replay Compatibility

- V0.1 preimages can still be replayed under V0.2 canonical rules.
- V0.1 entries are **not migrated** into V0.2 registry — they remain frozen in V0.1 artifact.
- V0.2 registry's `supersedes` field references V0.1 entry index 0 as proof of lineage.

## When to Reference V0.1

- Historical audit of the first seed artifact
- Understanding pre-V0.2 witness absence
- Verifying that no V0.1 entry was mutated after V0.2 sealed

## When to Ignore V0.1

- New registry entries (use V0.2)
- External replay GREEN confirmation (V0.2 witness rules)
- Supersede chains (V0.2 only)
- Sealing and append-only guarantees (V0.2 schema)

---

**Archive sealed.** No further updates to V0.1 artifacts permitted under this note.
