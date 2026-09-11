---
title: "A view's selection belongs in its subview, not in local state"
package: features/views
summary: "Store a view's inner selection via Views.useSetSubview, not local state; pass replace: true for self-made selections"
paths:
  - 'packages/views/src/SubviewContext/useSetSubview.ts'
  - 'packages/views/src/SubviewContext/useSubview.ts'
  - 'features/views/src/ViewRenderer/ViewRenderer.tsx'
tags: [subview, selection, sessions, navigation]
---

# A view's selection belongs in its subview, not in local state

What a view shows within itself (the selected data view, space, collection, query, and later a space's inner tabs) is announced via `Views.useSetSubview()` and read back with `Views.useSubview()`. The view area stores it on the pane's descriptor, which makes it part of the session: it survives session switches and restarts, labels the tab, is navigable with back/forward, and contributes a crumb to trails. Selecting is a navigation, so pass `{ replace: true }` for selections the view makes on its own behalf (defaults, keeping a title in sync) to avoid polluting the history. Unlike a view change, a subview change does **not** reset the pane's transient state, so scroll positions survive selection changes.
