---
title: 'Renderer SQL reads resolve asynchronously despite synchronous typings'
package: packages/sql
summary: 'Always await Sql.get and Sql.all results: the renderer adapter returns Promises despite synchronous typings'
paths:
  - 'packages/sql/src/Sql/**'
  - 'apps/desktop-electrobun/src/mainview/registerSqlAdapter.ts'
  - 'apps/desktop-electrobun/src/bun/sql/bunSqlAdapter.ts'
  - 'packages/databases/src/sql/sqlQueryEntries/**'
tags: [sql, rpc, async, renderer]
---

# Renderer SQL reads resolve asynchronously despite synchronous typings

`Sql.get`/`Sql.all` are typed synchronous, and the Bun process adapter (`bun:sqlite`) really is. But the renderer adapter forwards reads over Electrobun RPC, whose `rpc.request.*` calls return Promises — so in the renderer `Sql.all` returns a Promise typed as `T[]`, and `.map`-ing the "rows" throws. Existing readers never hit this because they all execute in the Bun process behind dedicated RPC adapters (search indexing, databases background sync). Renderer-side SQL reads must `await` the result (see `sqlQueryEntries`); awaiting is a no-op under the synchronous adapters, so one code path serves both.
