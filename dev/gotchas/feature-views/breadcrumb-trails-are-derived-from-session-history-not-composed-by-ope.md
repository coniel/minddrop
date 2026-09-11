---
title: 'Breadcrumb trails are derived from session history, not composed by openers'
package: features/views
summary: 'Declare breadcrumbLevel at view registration; trails come from pane history via resolveBreadcrumbTrail, openers pass none'
paths:
  - 'packages/views/src/sessions/resolveBreadcrumbTrail/resolveBreadcrumbTrail.ts'
  - 'packages/views/src/sessions/resolveBreadcrumbTrail/useBreadcrumbTrail.ts'
  - 'packages/views/src/types/View.types.ts'
tags: [breadcrumbs, sessions, history, navigation]
---

# Breadcrumb trails are derived from session history, not composed by openers

A view's trail is the run of previously shown views in its pane's back history (`resolveBreadcrumbTrail`), trimmed where the hierarchy breaks: a `root` always starts a new trail, a `branch` only extends a root's, and a `leaf` extends anything. Views declare their place via `breadcrumbLevel` at registration and default to `root`, so a view which does not declare one never appears in a trail and never inherits one. Openers pass no trail, and clicking a crumb navigates back through the history rather than reopening the view, which also restores that state's scroll positions and selections.
