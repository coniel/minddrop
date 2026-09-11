---
title: 'The test SQL adapter does not model a schema version bump'
package: packages/databases
summary: 'createTestSqlAdapter keeps data across close and reopen, so tests opening at a different SCHEMA_VERSION see stale rows'
paths:
  - 'packages/sql/src/test-utils/createTestSqlAdapter.ts'
  - 'packages/databases/src/test-utils/createTestSqlAdapter.ts'
  - 'packages/sql/src/Sql/Sql.ts'
  - 'packages/databases/src/sql/initializeDatabasesBackend/**'
tags: [sql, testing, schema-version, test-adapter]
---

# The test SQL adapter does not model a schema version bump

`createTestSqlAdapter` keeps a database per path and makes the connection's `close()` a no-op, so that reopening a path hands back the index the previous open wrote. `Sql.open` closes the connection at the top of every open, so a real close would leave the reopen with a dead handle. The cost is the version mismatch branch: on a mismatch `Sql.open` closes the database and deletes its file, then reopens the path expecting an empty database, and the test adapter hands back the populated one instead. Tests which open at the package's own `SCHEMA_VERSION` never take that branch; one which passes a different version sees `schemaChanged: true` over data that should have been dropped.
