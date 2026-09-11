---
title: 'Dark mode image effects must use native CSS filter functions'
package: ui/theme
summary: 'Use native CSS filter functions for dark mode image treatments; SVG url() filters rasterise on the CPU every repaint'
paths:
  - 'ui/theme/src/images.css'
  - 'ui/theme/src/useImageTreatment.ts'
tags: [dark-mode, images, css-filter, performance]
---

# Dark mode image effects must use native CSS filter functions

`images.css` dims with `brightness()` and inverts with `invert()`/`hue-rotate()`. An SVG `filter: url(#...)` reference gives a much better tone curve (a gamma curve darkens highlights while leaving shadows intact, where `brightness()` scales everything) but Chromium rasterises reference filters on the CPU on every repaint. On a transformed element such as `ImageViewer`, that re-runs per frame during zoom and pan: images take seconds to appear and vanish while panning. Do not reintroduce one for image treatments.
