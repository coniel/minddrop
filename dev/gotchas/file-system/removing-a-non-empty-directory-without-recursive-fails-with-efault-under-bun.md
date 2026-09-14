---
title: 'Removing a non-empty directory without recursive fails with EFAULT under Bun'
package: packages/file-system
summary: "Fs.removeDir on a directory with contents needs { recursive: true }; under Bun the underlying fs.rm reports the mistake as 'EFAULT: bad address in system call argument' rather than an is-a-directory error. The mock file system refuses the same call with a plain message so tests catch it"
paths:
  - 'apps/desktop-electrobun/src/bun/fileSystemRpc.ts'
  - 'packages/file-system/src/mock/mockRemoveDirEntry/**'
tags: [file-system, bun, desktop-app, testing]
---

# Removing a non-empty directory without recursive fails with EFAULT under Bun

The desktop app's `fsRemoveDir` handler calls `fs.rm(path, { recursive, force })`. Node rejects removing a directory that still has contents without `recursive` with a clear error; Bun (1.3.9) rejects it with `EFAULT: bad address in system call argument, rm '<path>'`, which reads like a platform fault rather than a missing option. `Fs.removeDir(path, { recursive: true })` works.

The mock file system refuses the same call ("cannot remove directory <path>, it is not empty"), so a test exercising the bare call on a directory with files fails with the real cause rather than passing and leaving the EFAULT for the app. Every call removing a directory that can hold files passes `{ recursive: true }`; the bare form is for directories already known to be empty, such as the history package's after moving their files out.

`Workspaces.delete` hit this before it moved to `Fs.trashDir`, and `deleteDatabaseEntryTemplate` removed a template directory holding files the same way, both while the mock still removed contents regardless.
