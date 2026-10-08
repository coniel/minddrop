---
title: 'Self-write detection compares contents for text and stats for other writes'
package: packages/file-system
summary: 'Text writes record a content hash, binary writes, copies and downloads record size and modification time; renames, deletions and adapter calls bypassing Fs record nothing and surface as external changes'
paths:
  - 'packages/file-system/src/writeRegistry/**'
  - 'packages/file-system/src/FileSystem/FileSystem.ts'
  - 'packages/file-system/src/startFileSystemWatcher/**'
tags: [file-system, watcher, self-write, binary]
---

# Self-write detection compares contents for text and stats for other writes

The watcher stays quiet about the app's own writes by comparing a changed file against what the app recorded when it wrote it:

- **Text writes** (`writeTextFile`, `writeTextFiles`, `writeJsonFile`, `writeYamlFile`) record a hash of the contents. The watcher reads the file back and compares.
- **Binary writes, copies and downloads** (`writeBinaryFile`, `copyFile`, `downloadFile`) record the file's size and modification time, read with a `stat` after the write completes. The watcher stats the file and compares, so a large media file costs no read. An external write landing between the app's write and that `stat` is taken for the app's own, a window of one `stat` call.

A write into a base directory (`baseDir` set) is recorded under its absolute path, the base directory's resolved path joined with the given one, since that is the path a watcher reports. Base directory paths resolve asynchronously when the adapter is registered, so a write landing before then is not recorded.

The registry is per process. In a multi-window setup each window has its own, so one window's writes reach the other windows as external changes, which is what lets them pick up a change another window made.

Not recorded, so dispatched as external changes:

- **Renames and moves.** The new path arrives as a creation, the old one as a deletion.
- **Deletions.** The watcher only sees that a path no longer exists, so the app's own deletions (an entry deleted in the app, a sidecar swept) are reported too.
- **Writes made through `FsAdapter` directly**, bypassing the `Fs` functions above. Every new `Fs` writer must record its write, or each use of it reads as an external change; `writeJsonFile` and `writeYamlFile` once skipped it, and every sidecar write scheduled a full background sync.

Reporting a self-write as external is the recoverable direction (the owning package re-reads a file it already has), but a package reacting expensively to changes should expect these.

Detection compares state rather than timing. An ignore window keyed on "we wrote this path N ms ago" would silently swallow a genuine external change landing inside the window, which is both invisible and unreproducible.
