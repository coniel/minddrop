---
title: 'The innermost draggable takes the press'
package: packages/drag-and-drop
summary: 'A draggable nested in another claims the press, so the outer one never activates and nothing it would have carried (its origin) reaches the drag; do not wrap a group item content in a draggable of its own'
paths:
  - 'packages/drag-and-drop/src/useDraggable/**'
  - 'ui/entity-groups/src/EntityGroupItem/**'
  - 'ui/components/src/ListPanelView/**'
tags: [drag-and-drop, nested, origin, entity-groups]
---

# The innermost draggable takes the press

`useDraggable` marks the press it arms, and a draggable around it leaves a marked press alone. Only one of them starts the drag, and it is the innermost, so a drag out of nested draggables carries the inner one's `id`, `data`, `origin` and `preview` and nothing of the outer's.

`EntityGroupItem` is an outer draggable whose `origin` is what tells a drop which group the item came out of. A consumer rendering its own draggable row inside it (a `DraggableListItem`) would start the drag from the row, with no origin, and every drop into a group of a type which takes no items from outside would then be ignored. `ListPanelView` renders its grouped rows without the draggable wrapper for that reason: the group's item drags the row.

Consumers with content that has to be draggable in its own right inside a group item should pass what the item would have carried through the content instead, or leave the drag to the item.
