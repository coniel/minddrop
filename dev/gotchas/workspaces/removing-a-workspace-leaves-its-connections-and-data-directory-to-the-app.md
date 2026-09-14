---
title: 'Removing a workspace leaves its connections and data directory to the app'
package: packages/workspaces
summary: "Workspaces.remove drops the workspace's store records but not its SQL connection, search index or AppData/workspaces/<id>/ directory; the desktop app releases those on the deleted event, index first, connection second, directory last"
paths:
  - 'packages/workspaces/src/removeWorkspace/**'
  - 'packages/workspaces/src/utils/resolveWorkspaceDataDirPath/**'
  - 'features/desktop-app/src/initializeWorkspaceCleanup/**'
  - 'packages/search/src/unloadWorkspaceSearch/**'
  - 'packages/search/src/handleSearchUnload/**'
tags: [workspaces, sql, search, desktop-app]
---

# Removing a workspace leaves its connections and data directory to the app

`Workspaces.remove` (and `Workspaces.delete` through it) takes the workspace out of the list, switches away from it, drops its records from every workspace scoped store and marks it unloaded. It does not touch the per-device state under `AppData/workspaces/<id>/`: the SQL database file and the search index there, nor the SQL connection open on both sides of the RPC and the search index held in Bun memory. `packages/workspaces` cannot import `sql` or `search`, so releasing those is the desktop app's job, done by `initializeWorkspaceCleanup` on `workspaces:workspace:deleted`.

The order there is load bearing. The search index goes first (`Search.unloadWorkspace`), because its debounced persist reads the SQL data version, so it has to be cancelled while the connection is still open. The SQL connection goes second (`Sql.close`, forwarded to Bun by the renderer adapter), because the database file is deleted with the directory: SQLite on macOS and Linux keeps writing to an unlinked file through an open handle, and on Windows the delete fails while the handle is open. The data directory goes last.

Anything else that starts cleaning that directory up, or that adds another per-workspace resource under it, has to keep to the same order.
