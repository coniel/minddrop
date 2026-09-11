---
title: "Which blocks are selected is held in the app's selection, not the editor"
package: packages/editor
summary: 'Selected block membership lives in @minddrop/selection as editor-block items, paired with the Slate range by selectBlocks'
paths:
  - 'packages/editor/src/selectBlocks/**'
  - 'packages/editor/src/withBlockSelection/**'
  - 'packages/editor/src/registerBlockSelectionSerializer/**'
  - 'packages/editor/src/useBlockSelection/**'
tags: [editor, selection, blocks, drag-and-drop]
---

# Which blocks are selected is held in the app's selection, not the editor

The Slate selection above says which blocks a selection _covers_; whether those blocks are selected at all is held in `@minddrop/selection` as items of type `editor-block`, keyed by the block's session ID and carrying a reference to the editor they came from.

This is what makes selections exclusive across the app: selecting blocks in one editor, or a card anywhere else, deselects the first editor's blocks with no cross editor wiring. It is also what lets blocks be dragged out of an editor, through the serializer registered for the type.

It also settles an ambiguity which would otherwise need a flag: a selection covering exactly one block is what both Escape and a triple click produce. Escape registers items, a triple click does not, so the two are told apart without inspecting the range.

The pairing is kept by `selectBlocks`, which sets both, and by `withBlockSelection`'s `onChange`, which drops the items as soon as the Slate selection stops covering whole blocks.
