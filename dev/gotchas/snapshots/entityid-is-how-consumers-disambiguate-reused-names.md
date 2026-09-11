---
title: 'entityId is how consumers disambiguate reused names'
package: packages/snapshots
summary: 'Rename ledger chains match by address; consumers use entityId to tell apart entities that reused the same name'
paths:
  - 'packages/snapshots/src/types/RenameEvent.types.ts'
  - 'packages/snapshots/src/recordRename/**'
  - 'packages/snapshots/src/replayRenames/**'
  - 'packages/snapshots/src/utils/resolveRenameChainEnds/**'
tags: [rename-ledger, entity-id, addresses, snapshots]
---

# `entityId` is how consumers disambiguate reused names

Ledger addresses are names, and names can be reused: delete a database, later create a new one with the same name, and a replayed old reference resolves to the new occupant. Rename events therefore record the entity's fixed ID in `entityId` for kinds whose entities carry one (databases; entries and properties have no fixed IDs). Chain matching in `replayRenames`/`resolveRenameChainEnds` stays address-based — the ID is used by consumers to disambiguate chains by identity instead of relying on names being unique over time.
