---
title: 'Untyped view options must be written through ContentViews.updateOptions'
package: packages/content-views
summary: 'Write view type specific options with ContentViews.updateOptions; ContentViews.update rejects them via excess property checks'
paths:
  - 'packages/content-views/src/updateContentViewOptions/**'
  - 'packages/content-views/src/updateContentView/**'
  - 'packages/content-views/src/types/ContentView.types.ts'
tags: [content-views, options, typescript, api]
---

# Untyped view options must be written through `ContentViews.updateOptions`

`ContentView.options` is `TViewOptions & ContentViewSortOptions`, so the default (untyped) `ContentView` no longer has an empty `object` for its options and TypeScript's excess property check applies. Passing a view type's own options as a literal through `ContentViews.update(id, { options: { columnOrder } })` is therefore rejected, while `ContentViews.updateOptions(id, { columnOrder })` (which takes an `object`) is fine. Use the latter for view type specific options.
