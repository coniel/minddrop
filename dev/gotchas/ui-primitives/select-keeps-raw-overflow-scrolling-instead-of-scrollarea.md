---
title: 'Select keeps raw overflow scrolling instead of ScrollArea'
package: ui/primitives
summary: "Select's list intentionally uses overflow-y: auto, not ScrollArea, because base-ui scroll arrows need the list as container"
paths:
  - 'ui/primitives/src/Select/**'
tags: [select, scrollarea, base-ui, css]
---

# Select keeps raw overflow scrolling instead of ScrollArea

`Select.css`'s `.select-list` scrolls with a plain `overflow-y: auto` rather than the `ScrollArea` primitive. This is deliberate: the base-ui Select owns the popup's scroll behaviour (the `ScrollUpArrow` and `ScrollDownArrow` elements plus keyboard-driven scrolling all operate on the `List` element as the scroll container, sized by the primitive's `--available-height` variable). Wrapping the list in `ScrollArea` would move scrolling to the ScrollArea viewport and break the arrows and keyboard scrolling, so the ScrollArea-everywhere convention does not apply here.
