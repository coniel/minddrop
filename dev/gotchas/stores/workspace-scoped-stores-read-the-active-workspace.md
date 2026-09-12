---
title: 'Workspace scoped stores read the active workspace'
package: packages/stores
summary: "A store created with scope: 'workspace' reads and writes the active workspace's record; clear() and load() before a workspace is active go to a default record the app never reads, so test setups load the workspace fixtures before any content fixtures"
paths:
  - 'packages/stores/src/createStoreRecords/**'
  - 'packages/stores/src/workspaceScope/**'
  - 'packages/stores/src/createObjectStore/**'
  - 'packages/stores/src/createArrayStore/**'
  - 'packages/stores/src/createKeyValueStore/**'
  - 'packages/workspaces/src/test-utils/setup-fixtures.ts'
  - 'packages/databases/src/test-utils/setup-tests.ts'
  - 'ui/components/src/test-utils.ts'
tags: [stores, workspaces, scoping, testing]
---

# Workspace scoped stores read the active workspace

A store created with `scope: 'workspace'` keeps one record per workspace ID and every function on the store itself (`get`, `getAll`, `set`, `load`, `clear`, `hydrate`, the hooks) addresses the **active** workspace's record. The active workspace is a stores-level context (`setActiveWorkspaceScope`) which `packages/workspaces` sets whenever the active workspace changes: in `Workspaces.initialize`, `Workspaces.setActive` and `Workspaces.remove`. Nothing else should set it. Another workspace's record is reached through `Store.in(workspaceId)`, which exposes the same functions bound to that workspace.

The twelve content stores are scoped: databases, entries and entry templates, data views, collections, spaces, queries, tags and tag groups, both designs stores and entity groups. Each content package's `loadWorkspace(workspace)` reads the workspace's files with its path and loads them through `in(workspace.id)`, and the `file-system:changed` handlers do the same with the change's workspace, so neither depends on which workspace is active.

Two consequences are easy to trip over:

- **`clear()` clears one workspace.** A scoped store's `clear()` empties the active workspace's record and leaves every other workspace's in place. Test cleanup that clears a scoped store after loading records for several workspaces leaves the inactive ones behind. The workspaces test fixtures' `cleanup` drops the fixture workspaces' records from every scoped store (`dropWorkspaceRecords`) for this reason, so suites using them are covered; a suite which sets the scope itself has to drop what it loaded.
- **Before a workspace is active, writes go to a default record.** While the scope is null (before `Workspaces.initialize` in the app, and in every test that never sets a scope) a scoped store reads and writes a default record, so it behaves exactly like an unscoped store. That record is not any workspace's: once a workspace becomes active it is out of reach until the scope is null again. Loading a scoped store before `Workspaces.initialize` has run is therefore a bug that presents as an empty store. The same applies to test setups: `setupWorkspaceFixtures` must run **before** any content fixtures are loaded into a scoped store, otherwise the fixtures land in the default record and the suite sees empty stores once the scope is set. A suite that uses content fixtures without the workspace fixtures at all works only until something in it resolves a workspace path.

The mirrored zustand state (`items`/`values`) only ever holds the active record, which is why `useStore` selectors, the dev tools inspector and the hooks needed no change. Persisted scoped stores carry the workspace ID on their persist and hydrate events, and the `packages/app` listeners for the two workspace targets resolve the directory from it, falling back to the active workspace for unscoped stores.
