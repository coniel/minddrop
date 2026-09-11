---
title: 'The block gutter is portalled and positioned against the viewport'
package: packages/editor
summary: 'BlockGutter portals into document.body with fixed positioning; scrolling drops the hovered block and clicks bubble via React'
paths:
  - 'packages/editor/src/BlockGutter/**'
  - 'packages/editor/src/useHoveredBlock/**'
tags: [editor, gutter, portal, positioning]
---

# The block gutter is portalled and positioned against the viewport

`BlockGutter` renders into `document.body` and positions itself with `position: fixed` from the hovered block's viewport rect, because the editor is routinely rendered inside a container which clips its overflow (cards, panels, views). Positioning it within the editor meant those ancestors clipped it away entirely.

Two consequences. Viewport coordinates go stale on scroll, so `useHoveredBlock` drops the hovered block on any scroll and re-measures on the next pointer move — the controls briefly disappear when scrolling with the pointer held still. And where the editor has no margin of its own, the controls are drawn over whatever sits beside it, which is why they carry their own surface and shadow.

Note that React portals still propagate events up the React tree, not the DOM tree, so the gutter's clicks reach the editor's ancestors despite living in the body. It stops propagation itself for that reason.
