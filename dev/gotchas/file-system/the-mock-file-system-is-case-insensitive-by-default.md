---
title: 'The mock file system is case-insensitive by default'
package: packages/file-system
summary: 'The mock matches paths regardless of case and Unicode normalisation form, like macOS and Windows, and keeps names as first stored; pass { caseSensitive: true } to initializeMockFileSystem for Linux behaviour'
paths:
  - 'packages/file-system/src/mock/'
tags: [file-system, mock, testing, case-sensitivity, unicode]
---

# The mock file system is case-insensitive by default

`initializeMockFileSystem` matches every path the way macOS (APFS) and Windows do: case is folded and Unicode names are normalised (NFC), so `Workspace/Note.md`, `workspace/NOTE.md` and an NFD-decomposed `Café.md` versus an NFC `Café.md` each name one file. Every lookup goes through `resolveMockPathKey`.

It is case-preserving. A file keeps the name it was first created with: writing to `note.md` when `Note.md` exists replaces `Note.md`'s contents and leaves its name, `readDir` returns stored names, and two `addFiles` descriptors differing only in case or normalisation load as one file (the first one's name, the last one's contents). A rename to the same path in another case renames the entry to the new case.

So a test can no longer seed two files whose names differ only in case and expect both to exist. Rename one fixture if the collision is accidental. A test about Linux behaviour, where those are two files, opts out with `initializeMockFileSystem(files, { caseSensitive: true })`. Where the mock is created inside another package's test-utils, `vi.mock('@minddrop/file-system/test-utils', ...)` can wrap `initializeMockFileSystem` to pass the option for a whole test file (see `backgroundSyncDatabases.case-sensitive.invariants.test.ts`).
