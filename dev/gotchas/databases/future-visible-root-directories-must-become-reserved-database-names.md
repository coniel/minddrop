---
title: 'Future visible root directories must become reserved database names'
package: packages/databases
summary: 'A feature claiming a visible workspace root directory must reserve that name in database create/rename validation'
paths:
  - 'packages/databases/src/utils/matchDatabaseReference/**'
  - 'packages/databases/src/utils/matchDatabaseEntryReference/**'
  - 'packages/databases/src/utils/matchDatabaseEntryAddress/**'
  - 'packages/databases/src/createDatabase/**'
  - 'packages/databases/src/renameDatabase/**'
tags: [references, addresses, validation, reserved-names]
---

# Future visible root directories must become reserved database names

Durable item references are natural workspace-relative addresses (`Books/Book.md`, `Books`), disambiguated by matchers that check the first path segment against existing database directories. Databases are currently the only visible directories at the workspace root, so there is no overlap. If another feature ever claims a visible root directory as its address space (e.g. `Widgets/`, `Spaces/`), that directory name must be rejected as a database name (create and rename validation) or the address spaces become ambiguous.
