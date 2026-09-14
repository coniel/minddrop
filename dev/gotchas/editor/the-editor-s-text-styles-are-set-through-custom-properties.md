---
title: "The editor's text styles are set through custom properties"
package: packages/editor
summary: 'Styling an editor from outside means setting --editor-font-family/-size/-line-height/-weight; the editor declares its own on .editor, so a font set on an ancestor is overridden.'
paths:
  - 'packages/editor/src/RichTextEditor/RichTextEditor.css'
  - 'packages/editor/src/default-element-configs/**/*.css'
  - 'packages/editor/src/BlockFrames/BlockFrames.css'
tags: [typography, css-custom-properties, theming, consumers]
---

# The editor's text styles are set through custom properties

Setting `font-family`, `font-size`, `line-height` or `font-weight` on an element wrapping a `RichTextEditor` does nothing. `.editor` declares all four itself, so the wrapper's values are overridden before they reach a single block, and the blocks below it declare more of their own.

A consumer designing the editor's text sets these on any ancestor instead:

```css
--editor-font-family
--editor-font-size
--editor-line-height
--editor-font-weight
```

`.editor` reads each as `var(--editor-font-size, var(--font-size-md))`, so unset they fall back to the theme tokens and nothing changes for consumers that do not care. Every block sizes against that base: headings are `em` multiples (1.5 / 1.25 / 1), code, math, HTML and break markers are `em` fractions, and the list and quote markers in `BlockFrames.css` compute their line height from `--editor-font-size` × `--editor-line-height` so they stay level with the text. Each `em` value equals the token it replaced at the 16px default base, so the default rendering is unchanged.

Two things deliberately do not scale: `--font-mono` on code, math and HTML (a serif document still wants monospaced code), and the heading weights, which stay `--font-weight-semibold`/`-bold` so a lighter document weight does not flatten its headings.

The first consumer of this is the `designs-next` editor element, which maps a design's text settings onto the four properties (`EditorElementRenderer`, with the family mapped off the text settings classes in its stylesheet).
