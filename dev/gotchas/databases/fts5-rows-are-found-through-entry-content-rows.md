---
title: 'FTS5 rows are found through entry_content_rows'
package: packages/databases
summary: 'Never select or delete entry_content rows by entry_id or property_name. UNINDEXED FTS5 columns have no index, so each lookup scans the whole table. Go through entry_content_rows by rowid.'
paths:
  - 'packages/databases/src/sql/schema.ts'
  - 'packages/databases/src/sql/sqlSearchEntryContent/**'
tags: [sql, fts5, performance, triggers]
---

# FTS5 rows are found through entry_content_rows

`entry_content` is an FTS5 table, and its `entry_id`, `property_name` and `property_type` columns are `UNINDEXED`. That keeps them out of the full-text index, but it also means SQLite has no way to look a row up by them. `WHERE entry_id = ?` scans every row.

The first version of the triggers deleted a value's row that way. Every deleted or updated text or content value scanned the whole table. At 30,000 entries, re-saving 300 entries took 22 seconds. A single edit paid about 75 ms, and a background sync of a thousand changed entries took over a minute.

`entry_content_rows` maps each value (`entry_id`, `property_name`, unique) to the rowid of its `entry_content` row, and the triggers delete by that rowid. The same 300 re-saves take 75 ms.

Anything else that needs one value's FTS row has to go through `entry_content_rows` too. A `MATCH` query is fine, because it uses the full-text index.
