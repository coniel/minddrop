---
title: 'ViewDataSource keeps its view-era name'
package: packages/content-views
summary: 'ViewDataSource and ViewDataSourceType are deliberately not named ContentViewDataSource'
paths:
  - 'packages/content-views/src/types/ViewDataSource.types.ts'
tags: [naming, content-views]
---

# ViewDataSource keeps its view-era name

The data-views to content-views rename (2026-09-16) moved every other name over, but left `ViewDataSource` and `ViewDataSourceType` alone: `ContentViewDataSource` reads worse than what it replaces, and the source a content view reads from really is a data source. Don't "fix" these to content-view naming without a deliberate decision.
