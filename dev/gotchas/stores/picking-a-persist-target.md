---
title: 'Picking a persist target'
package: packages/stores
summary: 'Pick app-config for device state, workspace-config for state that syncs with the workspace, app-workspace-config for both'
paths:
  - 'packages/stores/src/types/PersistOptions.types.ts'
  - 'packages/app/src/registerAppConfigStoreListeners/**'
  - 'packages/app/src/registerWorkspaceConfigStoreListeners/**'
  - 'packages/app/src/registerAppWorkspaceConfigStoreListeners/**'
tags: [stores, persistence, workspaces, app-config]
---

# Picking a persist target

A persisted store declares one of three targets, and the difference is which of two axes the state varies on: the workspace, and the device. `packages/app` registers a listener per target and owns the directories below.

| Target | Varies by | Written to | | ---------------------- | --------- | ---------------------------------------------------------- | | `app-config` | device | `AppData/stores/<namespace>.json` | | `workspace-config` | workspace | `<workspace>/.minddrop/stores/<namespace>.json` | | `app-workspace-config` | both | `AppData/workspaces/<workspaceId>/stores/<namespace>.json` |

`workspace-config` is the only one that travels: it lives inside the workspace directory, so it reaches every device the workspace syncs to. The other two sit in AppData and stay on the machine that wrote them.

`AppData/workspaces/<workspaceId>/` is the workspace's data directory, resolved by `Workspaces.resolveDataDirPath`, and it holds every per-workspace, per-device artifact, not only the stores: the SQL index (`data.db`) and the search index (`search-index.json`) sit next to `stores/`. All of it is derived or losable state that rebuilds from the workspace files, which is what separates it from `AppConfig` (see "`workspaces.json` is a hand-written config file").

The test to apply is what the user would expect after switching workspaces, and after opening the same workspace on a second machine. Open tabs and panel sizes should not follow them to the other machine but must differ per workspace, so they are `app-workspace-config`. The defaults applied to new databases belong to the workspace however it is reached, so they are `workspace-config`. The theme is the user's, not the workspace's, so it is `app-config`.

The two AppData targets are keyed differently on purpose: `app-workspace-config` uses the workspace ID rather than its path, so moving or renaming a workspace directory keeps its state.

Writes are fire and forget: a mutation dispatches `stores:store:persist` and returns. When something must not happen until the write has landed — reloading the window, quitting — await the store's `persisted()`, which resolves once the platform layer has acknowledged every write dispatched so far. It resolves immediately when no platform layer is listening, so it cannot hang a test suite that never registers one.
