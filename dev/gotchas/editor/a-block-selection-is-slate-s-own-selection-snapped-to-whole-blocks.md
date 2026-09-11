---
title: "A block selection is Slate's own selection, snapped to whole blocks"
package: packages/editor
summary: 'Block selections are Slate ranges snapped to whole blocks in onChange; there is no separate selected-block list'
paths:
  - 'packages/editor/src/withBlockSelection/**'
  - 'packages/editor/src/selectBlocks/**'
tags: [editor, selection, slate, blocks]
---

# A block selection is Slate's own selection, snapped to whole blocks

There is no separate list of selected blocks. A block selection is a Slate selection which covers whole top level blocks, and `withBlockSelection` expands any selection crossing a block boundary out to the blocks' edges. Delete, cut, copy and paste therefore keep working through Slate's own handling, and the editor never gives up DOM focus.

The consequences worth knowing:

- Non-contiguous selection is impossible, which markdown could not express anyway.
- The snap runs in `onChange`, not in `apply`. Slate's own transforms set exact expanded selections which have to be left alone, and `onChange` only runs once the selection has settled.
