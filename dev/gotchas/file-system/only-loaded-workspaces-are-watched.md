---
title: 'Only loaded workspaces are watched'
package: packages/file-system
summary: 'The desktop app runs one watcher per loaded workspace, started when the workspace loads and restarted when its directory moves; a listed workspace that has not been switched to is not watched'
paths:
  - 'packages/file-system/src/startFileSystemWatcher/**'
  - 'packages/file-system/src/types/FileSystemChange.types.ts'
  - 'features/desktop-app/src/initializeDesktopApp/**'
  - 'features/desktop-app/src/initializeWorkspaceWatchers/**'
tags: [file-system, watcher, workspaces, desktop-app]
---

# Only loaded workspaces are watched

`startFileSystemWatcher` takes workspace roots (`{ workspaceId, path }`) and stamps every `file-system:changed` event with the ID of the workspace whose root the changed path falls under, so the content packages' change handlers resolve IDs and directories against that workspace's path and write into that workspace's store record through `Store.in(workspaceId)`. A path under none of the roots is dropped.

The desktop app's `initializeWorkspaceWatchers` runs one watcher per loaded workspace rather than one watcher with every root, so a workspace can be added or dropped without restarting the others. It starts a watcher for every workspace `Workspaces.getLoaded()` returns and for each workspace the `workspaces:workspace:loaded` event announces, stops it on `workspaces:workspace:deleted`, and restarts it on the new path when a `workspaces:workspace:updated` event moves the directory (a rename). It is called last in `initializeDesktopApp`, after the active workspace has loaded, so that the initial load cannot race the watcher.

Workspaces load lazily: a listed workspace is loaded, and so watched, only once it has been switched to in the session. Edits made on disk to a workspace that is listed but not yet loaded are picked up by that workspace's first load, not by a watcher.
