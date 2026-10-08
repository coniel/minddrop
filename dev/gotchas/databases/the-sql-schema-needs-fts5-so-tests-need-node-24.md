---
title: 'The SQL schema needs FTS5, so tests need Node 24'
package: packages/databases
summary: 'SCHEMA_SQL creates an FTS5 table; node:sqlite before Node 24 lacks FTS5, so every test opening the test SQL database fails at schema creation (no such module: fts5)'
paths:
  - 'packages/databases/src/sql/schema.ts'
  - 'packages/databases/src/test-utils/setup-sql.ts'
  - 'packages/databases/src/test-utils/createTestSqlAdapter.ts'
  - 'package.json'
tags: [sql, fts5, testing, node]
---

# The SQL schema needs FTS5, so tests need Node 24

`SCHEMA_SQL` creates the `entry_content` FTS5 virtual table. The runtime adapter (`bun:sqlite`) has FTS5 compiled in, but the test adapter runs on `node:sqlite`, and Node ships SQLite with FTS5 only from Node 24. The root `package.json` declares `engines.node` as `>=24.0.0` for this reason.

Under an older Node every test which calls `setupTestSqlDatabase`, in `databases` and in every package seeding SQL through it (such as `search`), fails at schema creation with `no such module: fts5`. The fix is to run the suites on Node 24 or later, not to strip the table from the test schema.
