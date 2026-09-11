---
title: 'View components must size themselves with height: 100%'
package: features/views
summary: 'Give view root elements height: 100%; the ViewRenderer container is not flex so flex: 1 sizes to content'
paths:
  - 'features/views/src/ViewRenderer/ViewRenderer.tsx'
  - 'features/views/src/ViewRenderer/ViewRenderer.css'
  - 'features/spaces/src/SpaceView/SpaceView.css'
  - 'features/spaces/src/SpaceView/SpaceEditMode/SpaceEditMode.css'
tags: [css, layout, views, height]
---

# View components must size themselves with `height: 100%`

The view area container rendered by `ViewRenderer` is not a flex container, so a view's root element cannot rely on `flex: 1` to fill the content area — it sizes to content instead (only noticeable once inner percentage/flex chains silently collapse). Give view roots `height: 100%` (see `.design-studio`, `.space-view`, `.space-edit-mode`).
