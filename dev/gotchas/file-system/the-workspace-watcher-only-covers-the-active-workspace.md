---
title: 'The workspace watcher only covers the active workspace'
package: packages/file-system
summary: 'Only the active workspace is watched; the watcher tags each change with the workspace whose root it is under, and switching workspaces stops it and reloads'
paths:
  - 'packages/file-system/src/startFileSystemWatcher/**'
  - 'packages/file-system/src/types/FileSystemChange.types.ts'
  - 'features/desktop-app/src/initializeDesktopApp/**'
  - 'features/desktop-app/src/registerWorkspaceSwitchListener/**'
tags: [file-system, watcher, workspaces, desktop-app]
---

# The workspace watcher only covers the active workspace

`startFileSystemWatcher` takes workspace roots (`{ workspaceId, path }`) and stamps every `file-system:changed` event with the ID of the workspace whose root the changed path falls under, so the content packages' change handlers resolve IDs and directories against that workspace's path and write into that workspace's store record through `Store.in(workspaceId)`. A path under none of the roots is dropped.

`initializeDesktopApp` still calls it once, at the end, with only the active workspace's root: the other listed workspaces are not loaded into the stores, so watching them would only cost file handles. Switching workspace stops that watcher and reloads the window, which runs `initializeDesktopApp` again and starts a watcher on the workspace switched to. The watcher lives in the Bun process and does not survive the reload, so leaving it running would leave an orphan watching a workspace the app has moved on from.
