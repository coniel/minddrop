---
title: 'LayoutAutoFocusContext is deliberately single-purpose'
package: features/designs
summary: 'Keep LayoutAutoFocusContext single-purpose; generalise layout signal contexts only when a second one-shot signal appears'
paths:
  - 'features/designs/src/LayoutAutoFocusContext.tsx'
  - 'features/designs/src/LayoutRenderContext.ts'
  - 'features/designs/src/LayoutIdContext.ts'
  - 'features/designs/src/LayoutRenderer/**'
tags: [contexts, autofocus, layout-rendering, react]
---

# `LayoutAutoFocusContext` is deliberately single-purpose

The layout render path uses many small single-purpose contexts (`LayoutIdContext`, `LayoutRenderContext`, `DesignPreviewContext`, `LayoutAutoFocusContext`) rather than one render-options bag. The autofocus context was kept specific on purpose (decided in the entry-editor-autofocus WG): with a single consumer it is unclear whether a generic renderer-to-element signal mechanism should use claim-once, broadcast, or element-targeted semantics. When a second one-shot layout signal appears, generalise then (e.g. a named claim token context) instead of adding another bespoke context.
