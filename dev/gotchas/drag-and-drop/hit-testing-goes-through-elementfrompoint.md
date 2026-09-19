---
title: 'Hit testing goes through elementFromPoint'
package: packages/drag-and-drop
summary: 'Drop targets are found by document.elementFromPoint from the pointer position, so pointer-events: none, portals and overlays change what a drag is over; tests stub it through the gesture util'
paths:
  - 'packages/drag-and-drop/src/utils/resolveHitElement.ts'
  - 'packages/drag-and-drop/src/utils/resolveDropTargets/**'
  - 'packages/drag-and-drop/src/test-utils/gestures.ts'
tags: [drag-and-drop, hit-testing, testing, pointer-events]
---

# Hit testing goes through elementFromPoint

The engine never listens on drop targets. On every move it asks `document.elementFromPoint` what sits under the pointer and walks that element's ancestors for `[data-droppable-key]`, innermost first. Everything about what a drag is over follows from that:

- An element with `pointer-events: none` is skipped by the browser's hit test, so a drop target styled that way, or covered by an overlay which is not, is never over. The drag layer's preview is `pointer-events: none` for exactly this reason.
- A popover or menu rendered in a portal sits above the page, so a drag over it walks up to `body` and is over nothing, even when the popover is visually inside a drop target.
- A row's `::after` reaching into the spacing below it (`EntityGroupItem.css`) counts, since pseudo-elements take part in hit testing. Removing the reach brings back the indicator blinking out between rows.

The environment lays nothing out, so `document.elementFromPoint` returns nothing useful in tests. The gesture util (`dragOver`, `dragAndDrop` from `@minddrop/drag-and-drop/test-utils`) stubs it to return the target it is given for the whole gesture, and `cleanup` restores it. A test which moves the pointer somewhere else mid-drag sets `document.elementFromPoint` itself before firing the move.

The layer's clone carries a `data-drag-preview` attribute (and never the source's `id`), which is what an element styles its picked-up look by: a row which sits on the surface around it, such as `EntityGroupItem`, gives its preview a surface of its own that way, since the clone floats over the page with nothing behind it.
