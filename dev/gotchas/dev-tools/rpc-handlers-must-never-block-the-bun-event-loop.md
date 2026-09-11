---
title: 'RPC handlers must never block the bun event loop'
package: apps/dev-tools
summary: "Never call Bun.spawnSync in an RPC handler; run git through the async runGit so requests don't hit the 10s timeout"
paths:
  - 'apps/dev-tools/src/bun/rpc.ts'
tags: [rpc, bun, event-loop, git, timeout]
---

# RPC handlers must never block the bun event loop

The bun process answers every renderer request on its single event loop, and the renderer gives up on a request after ten seconds. A handler that calls `Bun.spawnSync` stalls every other request for its duration, so a burst of refreshes (one git scan per checkout, several refreshes queued by watcher events) used to push the file content requests past the timeout and leave the viewer stuck on stale content. Git runs through `runGit` in `bun/rpc.ts`, which spawns asynchronously and lets independent commands run in parallel. Keep new handlers on it.
