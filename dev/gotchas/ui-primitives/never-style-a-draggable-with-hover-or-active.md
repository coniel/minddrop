---
title: 'Never style a draggable with :hover or :active'
package: ui/primitives
summary: 'Native HTML5 drag leaves :hover and :active stuck; style draggables on data-pressed/data-hovered tracked in JS'
paths:
  - 'ui/primitives/src/hooks/usePressedState/**'
  - 'ui/drag-and-drop/src/useHoveredItem/**'
  - 'features/designs/src/useHoveredItem/**'
  - 'ui/primitives/src/Menu/Menu.css'
  - 'ui/entity-groups/src/EntityGroupItem/**'
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
- `useHoveredItem` (ui-drag-and-drop) holds a single hovered ID, so one row taking hover is what releases the last, and a late `pointerleave` cannot unhover its successor. Style on `[data-hovered='true']`.

A draggable often wraps content it does not own — `EntityGroupItem` around whatever the consumer renders, whose `.menu-item` is what the hover sticks to — so the hook cannot be applied to the styled element itself. `.menu-item` takes the state from an ancestor instead: its hover rules ignore `:hover` inside anything carrying `data-hovered` (`:hover:not([data-hovered] *)`) and take `[data-hovered='true'] &` in its place, so a row need only spread `hoveredProps` on its wrapper to move the whole subtree onto tracked hover. Any list of draggable menu items wants the same.

The symptom is worth recognising, because it does not look like stale hover: the row which lights up is one the pointer never touched, often in another group. A drop reorders the list, React reuses the DOM nodes for whatever now occupies their positions, and the frozen `:hover` rides along on the node rather than the item.

`useHoveredItem` also withholds hover from `dragstart` until the pointer moves under its own steam. A drop reflows the panel beneath a stationary pointer, and the browser announces whatever slid underneath as newly entered, which would otherwise light up a row the user never pointed at. Movement is measured against the last known position, since settling content fires moves at the position the pointer already occupies.

The properties tab never showed any of this because `SortableList` drags with `setPointerCapture` and `pointermove`/`pointerup` rather than native DnD, so the pointer is never taken away. That difference is the diagnostic: if a drag surface has these symptoms, check which of the two mechanisms it uses first.
