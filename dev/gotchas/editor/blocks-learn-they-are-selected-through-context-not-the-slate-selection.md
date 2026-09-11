---
title: 'Blocks learn they are selected through context, not the Slate selection'
package: packages/editor
summary: 'Blocks read selected state from BlockSelectionContext; slate-react memoisation hides app selection changes from elements'
paths:
  - 'packages/editor/src/utils/createRenderElement/**'
  - 'packages/editor/src/BlockSelectionContext.ts'
  - 'packages/editor/src/useSelectedBlockIds/**'
tags: [editor, selection, context, memoisation]
---

# Blocks learn they are selected through context, not the Slate selection

`createRenderElement` marks a block with `data-block-selected` from the `BlockSelectionContext`, which carries the IDs of the editor's selected blocks.

It cannot read the app's selection directly in each block: slate-react memoises an element against its _own_ intersection with the editor's selection, which does not change when a block is selected or deselected in the app, so the block would never repaint. Context updates cross memo boundaries, which is exactly what is needed here.
