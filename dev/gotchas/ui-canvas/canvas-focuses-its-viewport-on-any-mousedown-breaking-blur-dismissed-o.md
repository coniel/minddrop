---
title: 'Canvas focuses its viewport on any mousedown, breaking blur-dismissed overlays'
package: ui/canvas
summary: 'Blur-dismissed overlays inside Canvas must stopPropagation on mousedown, since Canvas focuses its viewport on any press'
paths:
  - 'ui/canvas/src/Canvas/Canvas.tsx'
  - 'features/queries/src/QueryBuilderCanvas/QueryBuilderCanvas.tsx'
tags: [canvas, focus, overlays, mousedown]
---

# Canvas focuses its viewport on any mousedown, breaking blur-dismissed overlays

With the default `shortcutScope="focus"`, `Canvas` calls `viewport.focus()` in its mousedown handler so focus-scoped keyboard shortcuts receive keys. The handler runs for every mousedown that bubbles to the viewport, including presses inside content rendered on the canvas.

Any overlay inside the canvas that dismisses itself on blur of an autofocused input (the searchable picker pattern) therefore breaks: pressing one of its options moves focus to the viewport, the input blurs, and the overlay unmounts before the click can deliver the selection. `preventDefault` on the overlay's mousedown does not help, since the viewport handler calls `focus()` explicitly.

Such overlays must call `stopPropagation()` in their mousedown handler (see `QuerySourcePicker` in `features/queries`). The canvas view's `DataViewNewEntryPicker` / `DataViewEntryPicker` flows share this trap.
