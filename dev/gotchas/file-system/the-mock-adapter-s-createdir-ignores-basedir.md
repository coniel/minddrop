---
title: "The mock adapter's createDir ignores baseDir"
package: packages/file-system
summary: 'The mock createDir ignores baseDir; pre-seed baseDir-scoped directories in tests before writing into them'
paths:
  - 'packages/file-system/src/mock/initializeMockFileSystem.ts'
tags: [file-system, mock, testing, basedir]
---

# The mock adapter's createDir ignores baseDir

The test-utils mock file system adapter resolves `createDir` paths against the mock root and ignores the `baseDir` option, so a `createDir` + `writeJsonFile` pair using a `baseDir` fails on the write with "parent dir path does not exist" (the directory was created at the root instead). Tests exercising baseDir-scoped writes must pre-seed the scoped directory (e.g. `app-data/stores`) in the mock file system, or exercise the dir-creation branch through a baseDir-less path.
