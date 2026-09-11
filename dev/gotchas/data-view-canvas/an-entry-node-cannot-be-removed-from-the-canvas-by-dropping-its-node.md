---
title: 'An entry node cannot be removed from the canvas by dropping its node'
package: data-views/canvas
summary: 'Removing a canvas card means Collections.removeItems; dropping the node from view data just re-adds it via reconcileNodes'
paths:
  - 'data-views/canvas/src/utils/reconcileNodes/**'
  - 'data-views/canvas/src/CanvasView/**'
  - 'data-views/canvas/src/CanvasNodeSelectionToolbar/**'
tags: [canvas, nodes, delete, collections]
---

# An entry node cannot be removed from the canvas by dropping its node

`reconcileNodes` gives **every** collection entry a node, auto-placing any entry that has none below the placed ones. Filtering an entry node out of the saved view data therefore does nothing useful: the next render re-appends it at the bottom of the canvas. The symptom is a "delete" that appears to fling the selected cards to the bottom of the canvas rather than remove them.

Removing a card means taking its entry out of the collection (`Collections.removeItems`), which is what the selection toolbar and Delete do. Holding shift escalates to `DatabaseEntries.delete`, behind a confirmation, which trashes the files. Both mirror the actions in `DatabaseEntryOptionsMenu`.

Non-entry nodes pass through reconciliation untouched, so if the canvas ever grows node types that are not backed by an entry, those _can_ be removed by dropping the node, and the delete path will need to branch on `node.type`.
