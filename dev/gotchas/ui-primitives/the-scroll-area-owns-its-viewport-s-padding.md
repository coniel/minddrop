---
title: "The scroll area owns its viewport's padding"
package: ui/primitives
summary: 'ScrollArea sets all four padding sides on every viewport at a specificity consumers cannot reach; pad with the padding prop or a box inside the viewport'
paths:
  - 'ui/primitives/src/ScrollArea/ScrollArea.css'
  - 'ui/primitives/src/ScrollArea/ScrollArea.tsx'
tags: [scroll-area, css, specificity, padding]
---

# The scroll area owns its viewport's padding

`ScrollArea` pads its viewport itself, from the `startPadding` / `endPadding` / `sidePadding` steps:

```css
.scroll-area:not(.scroll-area-horizontal) > .scroll-area-viewport {
  padding-top: var(--scroll-area-padding-start);
  /* … and the other three sides */
}
```

Two things make that a trap. The selector counts three classes — `:not()` contributes its argument — so the shape a consumer reaches for, `.my-class .scroll-area-viewport` or `.my-class > .scroll-area-viewport`, loses on specificity whatever the source order. And the root resets the three custom properties to `0`, so all four longhands are set on every scroll area whether or not the step props were passed. A consumer's `padding` on the viewport is therefore dropped in silence, which is how the design editor element shipped with its padding setting doing nothing.

Setting the custom properties from a consumer's own class is no better: it ties at one class with the reset on `.scroll-area`, leaving it to which stylesheet the bundler emits last. The properties also only model start, end and side, so a vertical scroll area cannot take different left and right padding through them.

Pad through the `padding` prop, which takes any CSS length per side and goes on the viewport inline, above the steps' rule. Where the padding belongs to the content rather than the scrollport, pad a box inside the viewport instead.
