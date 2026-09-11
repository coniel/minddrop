---
title: 'Property rename ledger recording is wired but dormant'
package: packages/databases
summary: 'Dispatch DatabasePropertyRenamedEvent when building property renames; the snapshots ledger handler already listens'
paths:
  - 'packages/databases/src/event-handlers/property-renamed/**'
  - 'packages/databases/src/events.ts'
  - 'packages/snapshots/src/event-handlers/database-property-renamed/**'
  - 'features/databases/src/DatabasePropertyEditor/**'
tags: [events, rename-ledger, properties, snapshots]
---

# Property rename ledger recording is wired but dormant

The snapshots package subscribes to `DatabasePropertyRenamedEvent` and records a rename ledger event (`kind: 'property'`), but nothing dispatches the event yet: `Databases.renameProperty` does not exist (`DatabasePropertyEditor` carries the TODO and currently refuses name changes). Whoever builds it gets ledger recording for free by dispatching the event, but must still re-key entry template property values per the TODO.
