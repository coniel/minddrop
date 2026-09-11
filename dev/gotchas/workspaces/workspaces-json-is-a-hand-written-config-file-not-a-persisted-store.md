---
title: 'workspaces.json is a hand-written config file, not a persisted store'
package: packages/workspaces
summary: 'Keep the workspace paths list in AppConfig/workspaces.json, never a persisted store; its location marks it as unlosable'
paths:
  - 'packages/workspaces/src/writeWorkspacesConfig/**'
  - 'packages/workspaces/src/initializeWorkspaces/**'
  - 'packages/workspaces/src/utils/resolveWorkspacesConfigFilePath.ts'
  - 'apps/desktop-electrobun/src/bun/windows/hasWorkspace.ts'
tags: [workspaces, config, persistence, bun]
---

# `workspaces.json` is a hand-written config file, not a persisted store

Almost all app-level state persists through `createKeyValueStore`'s `target: 'app-config'` option, which writes it to `AppData/stores/<namespace>.json`. The workspaces config deliberately does not: `writeWorkspacesConfig` writes `AppConfig/workspaces.json` itself, and `initializeWorkspaces` reads it back directly.

The reason is what the store layer's state means. Everything persisted through it is treated as losable — theme, sidebar widths, panel sizes, open tabs — and nothing guards it. The workspace list is the one piece of app-level state that is not: lose it and the user re-adds every workspace by hand, even though the directories are all still on disk. Keeping it out of the stores directory is what makes that status explicit. The file's location is the signal.

Which workspace is _active_ is losable — without it the app opens the first workspace — so it does persist through the store layer, as `active-workspace` at the `app-config` level. The contrast is the point: `workspaces.json` holds the paths list and nothing else.

There is also a practical reason. The Bun process reads the file before any webview exists: `hasWorkspace` (`apps/desktop-electrobun/src/bun/windows/hasWorkspace.ts`) parses it with `Bun.file` to decide whether to open the onboarding window or the main one. It has no event bus and no file system adapter, so it cannot go through a store.

Moving the paths list into a store alongside the active workspace was considered and rejected on the above. It is cheaper than it looks — the Bun side would parse the same JSON at a different path, and it would delete `writeWorkspacesConfig`, `resolveWorkspacesConfigFilePath` and the `WorkspacesConfig` type — so the reason not to is the meaning, not the cost.
