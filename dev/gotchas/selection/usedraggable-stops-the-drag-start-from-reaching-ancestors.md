---
title: 'useDraggable stops the drag start from reaching ancestors'
package: packages/selection
summary: "A draggable inside a draggable swallows dragstart, so an ancestor which adds its own data to the drag must do it in the capture phase"
paths:
  - 'packages/selection/src/useDraggable/useDraggable.ts'
  - 'ui/entity-groups/src/EntityGroupItem/EntityGroupItem.tsx'
tags: [drag-and-drop, selection, events, data-transfer]
---

# `useDraggable` stops the drag start from reaching ancestors

`useDraggable`'s `onDragStart` calls `event.stopPropagation()`, so that a draggable nested in another is the one dragged rather than its parent. The side effect is that an ancestor's `onDragStart` never runs, including one whose only job is to add its own keys to the drag's data transfer object.

`EntityGroupItem` is that ancestor: it marks the drag with the group it came from and with the group's type, which is what a drop target of the type checks before accepting the drag. A consumer rendering its own draggable row inside it — `ListPanelView` does, for rows carrying a selection item — left the drag unmarked, and every drop into or within a group was silently ignored. It marks the drag in `onDragStartCapture` instead, which runs before the inner handler and is unaffected by the stop.

Nothing clears the data transfer object in between: `serializeSelectionToDataTransfer` only sets keys, so a capture-phase write survives the drag start that follows it.
