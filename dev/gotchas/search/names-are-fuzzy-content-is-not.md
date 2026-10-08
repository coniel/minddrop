---
title: 'Names are fuzzy, content is not'
package: packages/search
summary: 'MiniSearch indexes titles, short property values and tags with typo tolerance. Text and content values go through SQLite FTS5, which matches word prefixes only. Never move long text back into MiniSearch.'
paths:
  - 'packages/search/src/searchFullTextIndex/**'
  - 'packages/search/src/searchContent/**'
  - 'packages/search/src/minisearchOptions.ts'
  - 'packages/search/src/utils/buildEntryDocument.ts'
  - 'packages/databases/src/sql/sqlSearchEntryContent/**'
  - 'packages/databases/src/sql/schema.ts'
tags: [search, minisearch, fts5, sql]
---

# Names are fuzzy, content is not

Search runs two engines. The MiniSearch index in the Bun process has titles, short property values and tags. A one-letter typo is the common case there, and edit-distance matching catches it. The text and content property values are in the `entry_content` FTS5 table in `data.db`, kept in sync with `entry_properties` by triggers. FTS5 matches them by word prefix, with no typo tolerance.

A typo in a word that only appears in an entry's body therefore finds nothing. That is deliberate. Fuzzy matching over long text produced mostly noise, and its weight was already derated to 0.2. The content postings were also nearly all of the old persisted index's size. That index was parsed on every launch and rewritten on every persist.

`searchFullTextIndex` lists the MiniSearch results first and appends the content matches of entries not already listed, so the two scores are never compared. An entry matching by name shows no content snippet.

The MiniSearch index is no longer persisted. It is rebuilt from SQL on every workspace load. Adding long text back to `buildEntryDocument` would make that rebuild, and the index, large again.
