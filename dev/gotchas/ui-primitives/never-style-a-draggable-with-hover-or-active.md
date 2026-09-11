---
title: 'Never style a draggable with :hover or :active'
package: ui/primitives
summary: 'Native HTML5 drag leaves :hover and :active stuck; style draggables on data-pressed/data-hovered tracked in JS'
paths:
  - 'ui/primitives/src/hooks/usePressedState/**'
  - 'ui/drag-and-drop/src/useHoveredItem/**'
  - 'features/designs/src/useHoveredItem/**'
  - 'packages/selection/src/useDraggable/**'
tags: [drag-and-drop, css, hover, pressed-state]
---

# Never style a draggable with `:hover` or `:active`

Native HTML5 drag (`draggable`/`dragstart`, as used by `@minddrop/selection`'s `useDraggable`) takes the pointer away from the page for the drag's duration. The browser freezes hover and swallows the pointer release, and does not reliably retire either afterwards:

- `:active` sticks to the element the drag started from and never clears. Every drag leaves another element looking pressed and they accumulate.
- `:hover` chains accumulate too. Several rows match `:hover` at once, including rows the pointer left long ago. Confirmed by `document.querySelectorAll(':hover')` returning two sibling rows after a drop.

Neither is fixable in CSS, because both are real browser state. A gating attribute only chooses when the stuck styling is visible: the whole accumulated set blinks off and back on as the gate toggles, which is the tell that something is stuck rather than mis-targeted.

Track both in JS instead, where the state cannot accumulate:

- `usePressedState` (ui-primitives) watches for the release on the document, since the element never sees it once a drag begins, and treats `drop`/`dragend` as releases. Style on `[data-pressed='true']`.
- `useHoveredItem` (features/designs) holds a single hovered ID, so one row taking hover is what releases the last, and a late `pointerleave` cannot unhover its successor. Style on `[data-hovered='true']`.

`useHoveredItem` also withholds hover from `dragstart` until the pointer moves under its own steam. A drop reflows the panel beneath a stationary pointer, and the browser announces whatever slid underneath as newly entered, which would otherwise light up a row the user never pointed at. Movement is measured against the last known position, since settling content fires moves at the position the pointer already occupies.

The properties tab never showed any of this because `SortableList` drags with `setPointerCapture` and `pointermove`/`pointerup` rather than native DnD, so the pointer is never taken away. That difference is the diagnostic: if a drag surface has these symptoms, check which of the two mechanisms it uses first.
