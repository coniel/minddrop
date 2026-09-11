---
title: 'Untyped view options must be written through DataViews.updateOptions'
package: packages/data-views
summary: 'Write view type specific options with DataViews.updateOptions; DataViews.update rejects them via excess property checks'
paths:
  - 'packages/data-views/src/updateDataViewOptions/**'
  - 'packages/data-views/src/updateDataView/**'
  - 'packages/data-views/src/types/DataView.types.ts'
tags: [data-views, options, typescript, api]
---

# Untyped view options must be written through `DataViews.updateOptions`

`DataView.options` is `TViewOptions & DataViewSortOptions`, so the default (untyped) `DataView` no longer has an empty `object` for its options and TypeScript's excess property check applies. Passing a view type's own options as a literal through `DataViews.update(id, { options: { columnOrder } })` is therefore rejected, while `DataViews.updateOptions(id, { columnOrder })` (which takes an `object`) is fine. Use the latter for view type specific options.
