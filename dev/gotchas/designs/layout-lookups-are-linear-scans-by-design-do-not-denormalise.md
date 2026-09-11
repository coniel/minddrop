---
title: 'Layout lookups are linear scans by design — do not denormalise'
package: packages/designs
summary: 'Layouts derive from DesignsStore by linear scan on purpose; add an internal index if needed, never a separate layouts store'
paths:
  - 'packages/designs/src/Layouts.ts'
  - 'packages/designs/src/getLayout/**'
  - 'packages/designs/src/DesignsStore.ts'
  - 'features/databases/src/DatabaseEntryRenderer/**'
tags: [layouts, performance, store, denormalisation]
---

# Layout lookups are linear scans by design — do not denormalise

`LayoutsStore` derives layouts from `DesignsStore` on demand (`getLayout` scans `designs × layouts`). This is deliberate: the Design is the single source of truth and a separate layouts store would need write-through sync on every design mutation (including whole-design saves from the studio) — a standing desync risk for an unmeasurable win.

Perf context (as of the figma-design-studio WG): the entry-rendering hot path (`DatabaseEntryRenderer`) resolves layouts non-reactively inside a `useMemo`, so the scan runs once per entry mount. Even hundreds of entries amount to microseconds; the real cost of large views is rendering N copies of the layout element tree, not the lookup.

If profiling ever shows lookups matter: add an internal `Map<layoutId, Layout>` index inside `LayoutsStore`, rebuilt lazily on `DesignsStore` changes. O(1) lookups, same public API, nothing authoritative to desync. Do **not** reach for a separate store.
