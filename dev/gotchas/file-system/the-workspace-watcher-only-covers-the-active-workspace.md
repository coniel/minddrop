---
title: 'The workspace watcher only covers the active workspace'
package: packages/file-system
summary: 'Only the active workspace is watched; switching workspaces stops the watcher and the reload starts a new one'
paths:
  - 'packages/file-system/src/startFileSystemWatcher/**'
  - 'features/desktop-app/src/initializeDesktopApp/**'
  - 'features/desktop-app/src/registerWorkspaceSwitchListener/**'
tags: [file-system, watcher, workspaces, desktop-app]
---

# The workspace watcher only covers the active workspace

`startFileSystemWatcher` is called once at the end of `initializeDesktopApp` with the active workspace's path. The other listed workspaces are not loaded into the stores, so watching them would only cost file handles.

Switching workspace stops that watcher and reloads the window, which runs `initializeDesktopApp` again and starts a watcher on the workspace switched to. The watcher lives in the Bun process and does not survive the reload, so leaving it running would leave an orphan watching a workspace the app has moved on from.
