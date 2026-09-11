---
title: 'The rename ledger records entity addresses, not file paths'
package: packages/snapshots
summary: 'Rename events store logical entity addresses (database/entry title), never file paths; feed item references to replayRenames as-is'
paths:
  - 'packages/snapshots/src/types/RenameEvent.types.ts'
  - 'packages/snapshots/src/recordRename/**'
  - 'packages/snapshots/src/replayRenames/**'
  - 'packages/snapshots/src/event-handlers/**'
tags: [rename-ledger, addresses, file-paths, snapshots]
---

# The rename ledger records entity addresses, not file paths

Rename events store logical addresses (`<database name>`, `<database name>/<entry title>`, `<database name>/<property name>`), never on-disk paths, so storage mode switches and file format changes do not touch the ledger. Item references use the same form, so an old reference can be fed to `replayRenames` as it stands.
