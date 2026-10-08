---
title: 'The content index is filled after a rebuild'
package: packages/databases
summary: 'A full SQL rebuild loads rows without the FTS5 triggers and fills entry_content in the background afterwards. Keep the triggers out of SCHEMA_SQL. Content search is partial right after a rebuild.'
paths:
  - 'packages/databases/src/sql/schema.ts'
  - 'packages/databases/src/sql/initializeDatabasesBackend/**'
  - 'packages/databases/src/sql/fillEntryContentIndex/**'
  - 'packages/databases/src/loadWorkspaceDatabases/**'
  - 'packages/databases/src/test-utils/setup-sql.ts'
tags: [sql, fts5, startup, performance]
---

# The content index is filled after a rebuild

The `entry_content` triggers live in `ENTRY_CONTENT_TRIGGERS_SQL`, not in `SCHEMA_SQL`. When `Sql.open` creates a fresh database (first launch, schema bump, deleted or corrupt `data.db`), `initializeDatabasesBackend` marks the content index pending in `meta` and rebuilds the rows without the triggers. It then creates the triggers, as it does on every startup. Once the workspace has loaded, `loadWorkspaceDatabases` has the backend run `fillEntryContentIndex`. The fill indexes the rows in chunks and clears the marker.

Indexing through the triggers during the rebuild made it about three times slower: 9.5 s against 3.2 s at 100,000 entries, all of it before the workspace could load. The fill takes about 2 s after startup and stalls the Bun process for at most about 70 ms at a time.

What follows from this:

- Content search returns partial results until the fill finishes. Name search is unaffected.
- Do not move the triggers back into `SCHEMA_SQL`. The rebuild would index through them again.
- If the workspace closes or the app quits during a fill, the marker stays set. The next launch's fill completes it, skipping the values already indexed.
- Code which creates the schema itself has to execute `ENTRY_CONTENT_TRIGGERS_SQL` too, as `setupTestSqlDatabase` does, or content edits are never indexed.
