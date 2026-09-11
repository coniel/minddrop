---
title: "Hiding a drag's source without cancelling the drag"
package: packages/editor
summary: 'Hide the gutter mid-drag with opacity only, set the hiding state at the end of dragstart, and end it on dragend not drop'
paths:
  - 'packages/editor/src/BlockGutter/**'
  - 'packages/editor/src/useBlockDrag.ts'
  - 'packages/editor/src/useHoveredBlock/**'
tags: [editor, drag-and-drop, webkit, gutter]
---

# Hiding a drag's source without cancelling the drag

Hiding the gutter while its handle is being dragged takes more care than it looks:

- It must not be unmounted. Removing a drag's source element part way through aborts the drag.
- It must keep its hit testing. `pointer-events: none` on the source cancels the drag in WebKit, so `opacity` alone does the hiding.
- Nothing may disturb the source before the `dragstart` handler returns, which is when the browser snapshots the drag image, so the state driving the hiding is set at the very end of the handler.
- `drop` fires _before_ `dragend`. Ending the drag state on the drop shows the controls again while the drag is still running, flashing them up against where the dragged block used to be, so only `dragend` ends it — and it also drops the hovered block, the block having moved out from under the controls.
