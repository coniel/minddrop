---
title: 'A database-level action rewrites entries itself'
package: packages/databases
summary: 'A handler rewriting entries for a schema change or a tag change updates the store and calls writeDatabaseEntry directly; routing through updateDatabaseEntry records an edit the user never made.'
paths:
  - 'packages/databases/src/event-handlers/property-renamed/**'
  - 'packages/databases/src/event-handlers/property-option-renamed/**'
  - 'packages/databases/src/event-handlers/property-removed/**'
  - 'packages/databases/src/event-handlers/tag-renamed/**'
  - 'packages/databases/src/event-handlers/tag-deleted/**'
  - 'packages/databases/src/renameDatabaseEntriesProperty/**'
  - 'packages/databases/src/renameDatabaseEntriesPropertyOption/**'
  - 'packages/databases/src/clearDatabaseEntriesProperty/**'
tags: [history, events, entries]
---

# A database-level action rewrites entries itself

`updateDatabaseEntry`, `updateDatabaseEntryProperty` and `clearDatabaseEntryProperty` dispatch `databases:entry:updated`, and `onUpdateEntry` records every property that event changed as an edit of the entry. A property rename, an option rename, a property removal or a tag rename or deletion reaching an entry is not an edit of it, and the record it writes names its own cause through the event's `action`. Routing the rewrite through the entry update API writes a second record reading as though the user changed the value by hand, which is precisely what the cause exists to distinguish.

So a handler acting on many entries rewrites each one itself: `DatabaseEntriesStore.update`, then `writeDatabaseEntry`, then one `sqlUpsertEntries` batch (or `sqlReindexDatabaseEntries` when the schema changed), then its own `History.record` stamped with the action. `renameDatabaseEntriesProperty`, `renameDatabaseEntriesPropertyOption` and `clearDatabaseEntriesProperty` do the store and file half for a schema change, and `rewriteEntryPropertyValues` computes the rewritten entry and its changes without touching anything.
