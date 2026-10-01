---
title: 'useLayout/useLayouts subscribe to ALL designs'
package: packages/designs
summary: 'useLayout/useLayouts re-render on any design change; never use them where many layouts mount at once, use a per-ID selector'
paths:
  - 'packages/designs/src/Layouts.ts'
  - 'packages/designs/src/DesignsStore.ts'
tags: [layouts, hooks, performance, subscriptions]
---

# `useLayout`/`useLayouts` subscribe to ALL designs

The reactive layout hooks subscribe to the entire `DesignsStore`, so any design mutation re-renders every subscriber. Fine for their current call sites (browser/studio lists). **Do not** casually reach for `useLayout` where many layouts mount at once (a space rendering hundreds of entries) to get live updates: every mounted layout would re-render on every studio edit (each element mutation saves the design). If live updates are ever wanted, use a per-ID selector subscription (only re-render when the specific layout's reference changes), not the all-designs hooks.
