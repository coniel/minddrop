---
title: "A scroll area's padding belongs inside it"
package: ui/primitives
summary: 'Pad a ScrollArea with its padding props, never the container around it: the scrollport clips whatever overhangs its edge'
paths:
  - 'ui/primitives/src/ScrollArea/ScrollArea.tsx'
  - 'ui/primitives/src/ScrollArea/ScrollArea.css'
tags: [scroll-area, layout, padding, scrollbar, clipping]
---

# A scroll area's padding belongs inside it

Whitespace around scrollable content goes on the `ScrollArea`'s padding props — `startPadding`, `endPadding` and `sidePadding` on the token scale, or `padding` for per-side lengths off it — which apply it to the viewport, rather than on the element wrapping the scroll area or on its own root. Two things go wrong when it sits outside.

**The scrollbar lands on the content.** The scrollbars are overlays positioned against the scroll area's own edges. Padding on a container around it insets the whole scroll area, so its content runs edge to edge inside the scrollport and the scrollbar sits on top of it. Padding inside leaves a gutter for the scrollbar to sit in.

**The scrollport clips what overhangs.** `.scroll-area-viewport` is `overflow: auto`, so it clips at its own edge. Anything a child draws outside itself is cut off when the content starts at that edge, and nothing reports it. `DropIndicator` is the case to know: its circle sits 1px to the left of the row it marks, so a list whose rows start at the scrollport's edge shows a circle with a flat side.
