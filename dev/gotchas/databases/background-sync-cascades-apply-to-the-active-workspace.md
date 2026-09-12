---
title: 'Background sync cascades apply to the active workspace'
package: packages/databases
summary: "handleBackgroundSyncResult writes the changeset's databases and entries into the changeset's workspace record, but the cascades it triggers (view, design and collection deletions, reference removal) go through API functions bound to the active workspace"
paths:
  - 'packages/databases/src/handleBackgroundSyncResult/**'
  - 'packages/databases/src/event-handlers/file-system-changed/**'
  - 'packages/databases/src/sql/backgroundSyncDatabases/**'
tags: [sync, workspaces, scoping, deferred]
---

# Background sync cascades apply to the active workspace

A background sync changeset names the workspace it scanned (`workspaceId`), and `handleBackgroundSyncResult` applies its database, entry and entry template changes to that workspace's store records through `Store.in(workspaceId)`, loading the upserted databases' views, designs and templates with the workspace's path. The `databases:sql-background-synced` event carries the ID on, so the search sync updates that workspace's index.

The cascades are not workspace-aware: deleting the views and designs of a deleted database goes through `DataViews.delete` and `Designs.delete`, and removing deleted entries from collections and view configs goes through `removeEntriesFromCollections` and `DataViews.removeReferences`. All of those read and write the active workspace and resolve file paths against it.

Today this cannot bite: only the active workspace is loaded and watched, so every changeset is the active workspace's. Once other workspaces are watched (fast switching, work group 4e of the workspace switching plan) a changeset for an inactive workspace would apply its cascades to the wrong one, so those API functions need the workspace threaded through first.
