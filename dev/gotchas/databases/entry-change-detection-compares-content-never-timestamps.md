---
title: 'Entry change detection compares content, never timestamps'
package: packages/databases
summary: 'Background sync must diff entries by content_hash; never by lastModified or mtime, which miss or over-report edits'
paths:
  - 'packages/databases/src/sql/backgroundSyncDatabases/**'
  - 'packages/databases/src/sql/sqlGetEntrySyncRecords.ts'
  - 'packages/databases/src/sql/sqlUpsertEntries.ts'
tags: [sql, sync, change-detection, timestamps]
---

# Entry change detection compares content, never timestamps

`backgroundSyncDatabases` diffs entries on `content_hash`. An earlier version compared `lastModified`, which silently missed every external edit in a database defining a `last-modified` property, since that property is only updated by the app. Renames and deletes were unaffected, being detected by path, which made the gap easy to miss.

Do not reintroduce a timestamp comparison here. mtime is also unsuitable, on top of the reasons above, because a restore or checkout moves it without the content changing, which would re-index the whole workspace.
