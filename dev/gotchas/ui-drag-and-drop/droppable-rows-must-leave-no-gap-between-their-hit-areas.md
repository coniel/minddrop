---
title: 'Droppable rows must leave no gap between their hit areas'
package: ui/drag-and-drop
summary: 'A drag crossing the spacing between two drop targets leaves both, so the indicator blinks out; reach into the spacing with a pseudo-element rather than removing it'
paths:
  - 'ui/drag-and-drop/src/DropIndicator/**'
  - 'ui/entity-groups/src/EntityGroupItem/**'
  - 'ui/entity-groups/src/EntityGroupList/EntityGroupGap.css'
tags: [drag-and-drop, drop-indicator, css, hit-area]
---

# Droppable rows must leave no gap between their hit areas

A list keeps space between its rows (`.menu-group` sets a 1px `row-gap`, published as `--drop-indicator-gap`), and `DropIndicator` centres itself in that space so the drop after one row and the drop before the next draw in the same place. The space is also where the pointer is over neither row: `dragleave` fires on the row above before `dragenter` fires on the one below, and for those frames nothing shows the indicator, which reads as a flash every time a drag crosses a row boundary.

Removing the spacing is not the fix: the indicator's centring depends on it, and it is the list's own look. Close the gap as a hit area instead. A pseudo-element reaching into the spacing takes pointer and drag events for its element without being a separate target, so the pointer never leaves the row: `EntityGroupItem` reaches over the gap below it (`&::after { inset: 100% 0 calc(-1 * var(--drop-indicator-gap)) }`) and `EntityGroupGap`, when the collapsed groups on both sides leave it a hairline, reaches into the groups on either side of it the same way. Any new droppable row in a spaced list wants the same.

None of this can be checked in tests: the environment applies no CSS, so hit areas are whatever the DOM says they are.
