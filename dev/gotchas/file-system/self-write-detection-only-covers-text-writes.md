---
title: 'Self-write detection only covers text writes'
package: packages/file-system
summary: 'Only writeTextFile(s) record self-write hashes; writeBinaryFile writes surface as external changes from the watcher'
paths:
  - 'packages/file-system/src/writeRegistry/**'
  - 'packages/file-system/src/FileSystem/FileSystem.ts'
  - 'packages/file-system/src/startFileSystemWatcher/**'
tags: [file-system, watcher, self-write, binary]
---

# Self-write detection only covers text writes

`Fs.writeTextFile` and `Fs.writeTextFiles` record a content hash, which is how the watcher recognises its own write and stays quiet about it. `Fs.writeBinaryFile` does not, so the app's own media writes are dispatched as ordinary changes. That is the recoverable direction (the owning package re-reads a file it already has), but a package reacting expensively to binary changes would want to know.

Note the detection compares content rather than timing. An ignore-window keyed on "we wrote this path N ms ago" would silently swallow a genuine external change landing inside the window, which is both invisible and unreproducible.
