---
title: 'A drag whose source is unmounted by the drop never ends'
package: packages/selection
summary: 'useDraggable ends a drag from the source element, which a drop into another list unmounts first; ending it from document listeners breaks dropping, so make drops read dataTransfer instead of drag state'
paths:
  - 'packages/selection/src/useDraggable/**'
  - 'packages/selection/src/SelectionStore.ts'
  - 'ui/entity-groups/src/useDraggedEntityGroupItems.ts'
tags: [drag-and-drop, selection, deferred]
---

# A drag whose source is unmounted by the drop never ends

`useDraggable` clears the store's `isDragging` from its `onDragEnd` prop, which the browser fires at the element the drag started from. A drop which moves the item into another list has already unmounted that element, so nothing hears it: `isDragging` stays true until the next drag starts, and `SelectionDragEndedEvent` is never dispatched for that drag at all. Tracked as Issue #16.

Nothing shows it at present — the drop indicators are cleared by the drop itself — but anything gating on `Selection.useIsDragging` will see a drag which never finished.

Watching the document for `drop`/`dragend` looks like the fix and was tried twice: both times it broke dropping outright. The document sees the drop in the capture phase, before the target handles it, so ending the drag there re-renders the target and strips the drop handlers it only mounts while a drag is in flight — and the browser drains microtasks between event listeners, so `queueMicrotask` is not late enough to escape it either. `setTimeout` is, in theory, but none of it can be verified in tests: happy-dom batches the store update into `act`, so React never re-renders mid-dispatch there and the integration tests pass against every broken version.

A fix wants the drop to stop depending on drag state instead. The dragged selection is already serialised into `dataTransfer` and handed to `onDrop` as `drop.data`; consumers which read it from React state (`useDraggedEntityGroupItems` in `ui/entity-groups`) are what make the timing matter.
