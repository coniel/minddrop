---
title: 'A drop handler runs before the drag state clears'
package: packages/drag-and-drop
summary: 'onDrop is called while the drag is still active; the store clears, the targets are notified and the ended event dispatches after it returns, so a handler reading the drag state sees the drag it is handling'
paths:
  - 'packages/drag-and-drop/src/endDrag.ts'
  - 'packages/drag-and-drop/src/useDroppable/**'
tags: [drag-and-drop, ordering, events]
---

# A drop handler runs before the drag state clears

`endDrag` calls the innermost target's `onDrop` first and only then clears the store, tells the targets the drag is over, removes `html[data-dragging]`, swallows the trailing click and dispatches `drag-and-drop:ended`. The order is deliberate: clearing first re-renders the target, and a target which mounts its drop handling only while a drag is in flight (`acceptsDrop ? droppableProps : {}`) would be stripped of it before it could take the drop, which is how the native version lost drops whose source the drop unmounted.

What follows from it:

- `DragAndDrop.getActiveDrag()` inside `onDrop` returns the drag being dropped. Hooks reading the drag state (`useDraggedEntityGroupItemIds`) still hold the dragged items during the handler.
- A drop handler which throws does not leave the drag stuck: the teardown runs in a `finally`.
- The ended event, like every event, reaches its listeners on a microtask, so the drag layer settles the preview a tick after the drop has been applied. Anything which has to run synchronously with the drop belongs in the handler, not in a listener.
