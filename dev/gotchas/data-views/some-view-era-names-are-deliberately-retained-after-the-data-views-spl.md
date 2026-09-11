---
title: 'Some view-era names are deliberately retained after the data-views split'
package: packages/data-views
summary: 'Keep the .view extension, views/ dir name and ViewDataSource type names; do not rename them to data-view without a decision'
paths:
  - 'packages/data-views/src/constants.ts'
  - 'packages/data-views/src/types/ViewDataSource.types.ts'
  - 'packages/data-views/src/utils/resolveViewsDirPath.ts'
  - 'packages/data-views/src/utils/resolveViewFilePath.ts'
tags: [naming, data-views, file-format, legacy]
---

# Some view-era names are deliberately retained after the data-views split

The views / data-views split (2026-08-05) renamed events (`data-views:data-view:*`), the ID prefix (`data-view_<uuid>`), fixtures, and i18n keys (`dataViews.*`), but deliberately kept: the on-disk `.view` file extension and `views/` workspace data directory (`ViewFileExtension` / `ViewsDirName` in `packages/data-views`), and the `ViewDataSource` / `ViewDataSourceType` type names ("DataViewDataSource" would be awkward). Don't "fix" these to data-view naming without a deliberate decision.
