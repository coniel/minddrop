---
title: "A read after a queued write returns the write's contents"
package: packages/file-system
summary: 'IoQueue.read returns queued write contents, so carry previous contents in events rather than reading them back'
paths:
  - 'packages/file-system/src/ioQueue/**'
tags: [file-system, io-queue, read-after-write, events]
---

# A read after a queued write returns the write's contents

`IoQueue.read` returns a path's pending write contents when one is queued for it, for read-after-write consistency. Reading a file to find out what it held _before_ a write therefore cannot be done once that write is queued, even though it has not reached the disk yet. The queue does not serialize a read behind a write of the same path, so there is no ordering to rely on beyond the caller's own.

Anything wanting to announce a write to listeners that care what it replaced should therefore carry the previous contents in the announcement rather than leave listeners to read for them. The write path generally has them in hand already: `writeDatabaseEntry` reads the file to merge into it.
