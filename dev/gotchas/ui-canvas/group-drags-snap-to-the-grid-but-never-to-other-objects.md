---
title: 'Group drags snap to the grid but never to other objects'
package: ui/canvas
summary: 'CanvasSelectionBox group drags snap to the grid only; object snapping is not applied to multi-node moves'
paths:
  - 'ui/canvas/src/CanvasSelectionBox/CanvasSelectionBox.tsx'
  - 'ui/canvas/src/utils/getObjectSnap/**'
tags: [canvas, snapping, group-drag]
---

# Group drags snap to the grid but never to other objects

`CanvasSelectionBox` snaps the dragged group's bounds origin to the grid when `snapToGrid` is on, but does not apply object snapping even when `snapToObjects` is. `getObjectSnap` aligns a frame against a list of other frames, and for a group the obvious target list includes the selection's own members, which would snap the bounds to the nodes inside it. Doing it properly means excluding every selected node from the targets and aligning the union bounds rather than a node frame.

A single-node drag is unaffected and still snaps to both.
