---
title: 'Item references resolve against the active workspace'
package: packages/item-references
summary: "ItemReferences.resolve matches references through adapters reading the active workspace's stores, so a non-active workspace's collections, data views and entity groups resolve their references wrongly when loaded"
paths:
  - 'packages/item-references/src/resolveItemReferences/**'
  - 'packages/item-references/src/matchItemReference/**'
  - 'packages/databases/src/utils/matchDatabaseEntryReference/**'
  - 'packages/databases/src/utils/matchDatabaseReference/**'
  - 'packages/collections/src/loadWorkspaceCollections/**'
  - 'packages/data-views/src/loadWorkspaceDataViews/**'
  - 'packages/data-views/src/loadDataView/**'
  - 'packages/entity-groups/src/loadWorkspaceEntityGroups/**'
tags: [item-references, workspaces, scoping, deferred]
---

# Item references resolve against the active workspace

`ItemReferences.resolve` hands each durable reference to the registered adapters, whose `match` functions look the addressed item up in their package's store: the databases adapters read `DatabasesStore` and `DatabaseEntriesStore` through the active workspace's record. Nothing on the resolve path carries a workspace ID.

The content packages' `loadWorkspace(workspace)` functions take the workspace explicitly and load into `Store.in(workspace.id)`, but the collections, data views and entity groups loaders (and the data views change handler, through `loadDataView`) resolve their item references on the way in. Called for a workspace that is not the active one, they resolve those references against the active workspace's entries: references to the loaded workspace's own entries come back missing and are dropped (or kept as raw references where `keepMissing` is set).

Today this cannot bite: the desktop app only ever loads the active workspace, and the watcher only covers it. It becomes a real constraint once other workspaces are loaded while one is active (fast switching, work group 4e of the workspace switching plan): either the load of a workspace has to run while it is active, or the adapters have to take the workspace to resolve against.
