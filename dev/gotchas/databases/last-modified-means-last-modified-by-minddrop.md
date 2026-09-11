---
title: 'Last Modified means last modified by MindDrop'
package: packages/databases
summary: 'The last-modified property only updates on app edits; never write file mtime into it on external change detection'
paths:
  - 'packages/databases/src/utils/setTimestampProperties/**'
  - 'packages/databases/src/createDatabaseEntry/**'
  - 'packages/databases/src/updateDatabaseEntry/**'
  - 'packages/databases/src/updateDatabaseEntryProperty/**'
tags: [timestamps, metadata, external-edits, sync]
---

# Last Modified means last modified by MindDrop

`setTimestampProperties` is only reached from `createDatabaseEntry`, `updateDatabaseEntry` and `updateDatabaseEntryProperty`, so an entry edited in another editor keeps whatever the app last wrote. The value lags until the entry is next edited in the app.

This is deliberate. The obvious fix, writing the file's mtime into the property when a change is detected, would be wrong often enough to matter: mtime says when the bytes landed on this disk, not when someone edited the entry. Dropbox and iCloud generally preserve the original, `git checkout` and `rsync` without `-t` stamp the file on arrival, and nothing in the filesystem says which case you are in. Persisting a guess into a user-visible value that later syncs to other devices makes the error permanent and indistinguishable from an authoritative value, where lagging is at least a known, bounded limitation.

Users wanting external edits reflected are responsible for having their editor maintain the property.

Note this concerns the displayed value only. External edits **are** detected, by content hash (see below).
