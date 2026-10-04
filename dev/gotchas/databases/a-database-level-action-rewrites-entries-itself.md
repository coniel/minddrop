---
title: 'A database-level action rewrites entries itself'
package: packages/databases
summary: 'A handler rewriting entries for a schema change or a tag change updates the store and calls writeEntry directly; routing through updateEntry records an edit the user never made.'
paths:
  - 'packages/databases/src/event-handlers/property-renamed/**'
  - 'packages/databases/src/event-handlers/property-option-renamed/**'
  - 'packages/databases/src/event-handlers/property-removed/**'
  - 'packages/databases/src/event-handlers/tag-renamed/**'
  - 'packages/databases/src/event-handlers/tag-deleted/**'
  - 'packages/databases/src/renameEntriesProperty/**'
  - 'packages/databases/src/renameEntriesPropertyOption/**'
  - 'packages/databases/src/clearEntriesProperty/**'
tags: [history, events, entries]
---

# A database-level action rewrites entries itself

`updateEntry`, `updateEntryProperty` and `clearEntryProperty` dispatch `databases:entry:updated`, and `onUpdateEntry` records every property that event changed as an edit of the entry. A property rename, an option rename, a property removal or a tag rename or deletion reaching an entry is not an edit of it, and the record it writes names its own cause through the event's `action`. Routing the rewrite through the entry update API writes a second record reading as though the user changed the value by hand, which is precisely what the cause exists to distinguish.

So a handler acting on many entries rewrites each one itself: `EntriesStore.update`, then `writeEntry`, then one `sqlUpsertEntries` batch (or `sqlReindexEntries` when the schema changed), then its own `History.record` stamped with the action. `renameEntriesProperty`, `renameEntriesPropertyOption` and `clearEntriesProperty` do the store and file half for a schema change, and `rewriteEntryPropertyValues` computes the rewritten entry and its changes without touching anything.
