---
title: 'Address change handlers rewrite the active workspace'
package: packages/item-references
summary: "The item-references:addresses-changed event carries no workspace, so the handlers rewriting referencing files (entries, collections, data views, entity groups) look for references in the active workspace, missing the rewrites when a background sync of an inactive workspace renamed entries"
paths:
  - 'packages/item-references/src/events.ts'
  - 'packages/databases/src/handleBackgroundSyncResult/**'
  - 'packages/databases/src/event-handlers/item-addresses-changed/**'
  - 'packages/collections/src/event-handlers/item-addresses-changed/**'
  - 'packages/data-views/src/event-handlers/item-addresses-changed/**'
  - 'packages/entity-groups/src/event-handlers/item-addresses-changed/**'
tags: [item-references, workspaces, scoping, sync, deferred]
---

# Address change handlers rewrite the active workspace

`item-references:addresses-changed` carries the changed items' IDs and their old and new addresses, but not the workspace they belong to. Its handlers in `databases`, `collections`, `data-views` and `entity-groups` look the referencing entries, collections, views and groups up in the **active** workspace's store records and rewrite their files under the active workspace's path.

User-driven renames dispatch the event for the active workspace, which is right. `handleBackgroundSyncResult` dispatches it for the changeset's workspace, which since fast switching (work group 4e of the workspace switching plan) can be an inactive loaded workspace: its first load and every watched change scan it in the background. Item IDs are unique across workspaces, so the handlers find nothing in the active workspace and write nothing wrong; the inactive workspace's referencing files simply keep their stale addresses until something else rewrites them, and references to renamed entries drop on that workspace's next load.

Fixing it means the event carrying the workspace ID and the four handlers, with `writeDatabaseEntry`, `getReferencingEntries`, `persistVirtualViewConfig`, `writeEntityGroups` and the rename history record beneath them, taking it the way the background sync cascades do.
