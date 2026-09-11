---
title: 'Create directories with Fs.ensureDir, never a check-then-create guard'
package: packages/file-system
summary: 'Use Fs.ensureDir to create directories; an exists-then-createDir guard races and throws EEXIST for the loser'
paths:
  - 'packages/file-system/src/FileSystem/FileSystem.ts'
  - 'packages/file-system/src/mock/initializeMockFileSystem.ts'
tags: [file-system, directories, race-condition]
---

# Create directories with `Fs.ensureDir`, never a check-then-create guard

`Fs.createDir` without `recursive` throws `EEXIST` when the directory is already there, so `if (!(await Fs.exists(dir))) { await Fs.createDir(dir); }` is a check-then-create race: two writers targeting the same new directory both see it missing and both create it, and the loser's whole operation rejects. `Fs.ensureDir` creates recursively, which is idempotent, so concurrent callers are safe.

This bites wherever an entity's creation dispatches an event whose handlers write into the directory being created, since the handlers run while the creating function is still awaiting its own directory write.

The mock file system mirrors the OS here: a non-recursive `createDir` over an existing path throws. It did not until 2026-09-09, which is why these races only ever showed up in the running app.
