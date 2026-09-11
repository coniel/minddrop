---
title: 'useLayout/useLayouts subscribe to ALL designs'
package: packages/designs
summary: 'useLayout/useLayouts re-render on any design change; do not use them in DatabaseEntryRenderer, use a per-ID selector'
paths:
  - 'packages/designs/src/Layouts.ts'
  - 'packages/designs/src/DesignsStore.ts'
  - 'features/databases/src/DatabaseEntryRenderer/**'
tags: [layouts, hooks, performance, subscriptions]
---

# `useLayout`/`useLayouts` subscribe to ALL designs

The reactive layout hooks subscribe to the entire `DesignsStore`, so any design mutation re-renders every subscriber. Fine for their current call sites (browser/studio lists). **Do not** casually switch `DatabaseEntryRenderer` to `useLayout` to get live-updating entries: hundreds of mounted entries would re-render on every studio edit (each element mutation saves the design). If live entry updates are ever wanted, use a per-ID selector subscription (only re-render when the specific layout's reference changes), not the all-designs hooks.
