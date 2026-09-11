---
title: 'A group drag reports through onNodesFrameChange, not onFrameChange'
package: ui/canvas
summary: 'Canvas consumers with multi-selection must handle onNodesFrameChange; group drags never fire per-node onFrameChange'
paths:
  - 'ui/canvas/src/Canvas/Canvas.tsx'
  - 'ui/canvas/src/CanvasSelectionBox/**'
tags: [canvas, group-drag, multi-select, callbacks]
---

# A group drag reports through `onNodesFrameChange`, not `onFrameChange`

Moving a multi-node selection deliberately does not fire each node's own `onFrameChange`. Consumers typically implement it as a read-modify -write against a snapshot captured in the closure, so N calls in one tick would each overwrite the last, and only one node would move.

`Canvas` takes `onNodesFrameChange` instead, called once on group-drag mouseup with every moved node's frame, so the consumer applies them in a single update. A consumer that supports multi-selection must handle it; implementing only `onFrameChange` silently drops group moves.
