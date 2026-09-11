---
title: "A container's markers are drawn by the editor, not by the block"
package: packages/editor
summary: 'List and quote markers come from BlockFrames context; new frame data must feed resolveBlockFramesSignature to redraw'
paths:
  - 'packages/editor/src/BlockFrames/**'
  - 'packages/editor/src/BlockFramesContext/**'
  - 'packages/editor/src/utils/resolveBlockFrames/**'
  - 'packages/editor/src/withFrames/**'
tags: [editor, frames, lists, memoisation]
---

# A container's markers are drawn by the editor, not by the block

List items and quotes are ancestry frames on a block rather than element types of their own, so a list item is a `paragraph` carrying a `list-item` frame. Bullets, numbers, checkboxes and quote bars are drawn by `BlockFrames` from data resolved across the whole document, since a block cannot tell on its own whether it opens its container or which number an ordered item takes. That resolution is provided as context and memoised against a signature of the document's frames, so a frame change has to show up in `resolveBlockFramesSignature` or the markers will not redraw.
