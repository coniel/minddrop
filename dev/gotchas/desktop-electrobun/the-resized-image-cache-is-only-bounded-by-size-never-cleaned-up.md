---
title: 'The resized image cache is only bounded by size, never cleaned up'
package: apps/desktop-electrobun
summary: 'Resized image variants are orphaned on source changes; pruneImageCache runs FIFO at startup only, keep image-stats.json outside'
paths:
  - 'apps/desktop-electrobun/src/bun/images/imageCache.ts'
  - 'apps/desktop-electrobun/src/bun/images/imageStats.ts'
tags: [images, cache, disk, pruning]
---

# The resized image cache is only bounded by size, never cleaned up

`getResizedImage` keys variants on `hash(sourcePath + mtime)`, so deleting, renaming, or editing a source image orphans its variants rather than removing them. Nothing hooks those events, and the filename is a one-way hash so the orphans cannot be traced back to a source. The only reclamation is `pruneImageCache()`, which runs once at startup and deletes oldest-first until the directory is back under 500 MB.

Correctness is never at risk: the mtime in the key means a stale variant cannot be served for a changed image, so this is wasted disk only. Two weaknesses if it is ever worth improving: the prune sorts by the cache file's write time and reads do not touch it, so it is FIFO rather than LRU and can evict variants that are in daily use; and running only at launch means a long session stays over the limit until the next restart.

Note that `image-stats.json` deliberately lives **outside** the cache directory, both so the prune cannot delete it and because it cleans itself up (see `initializeImageStats`).
