---
title: 'Embedded content views outlive the space that embeds them'
package: packages/spaces
summary: 'Deleting a space or removing a content-view element never deletes the embedded content view; prompt the user rather than auto-delete'
paths:
  - 'packages/spaces/src/deleteSpace/**'
  - 'packages/spaces/src/utils/setLayoutElementContent/**'
  - 'packages/designs/src/design-element-configs/content-view.ts'
tags: [spaces, content-views, deletion, embedded-views]
---

# Embedded content views outlive the space that embeds them

A `content-view` design element references a content view by ID; the view itself is an ordinary file-persisted content view under the workspace `views/` dir, not something the space owns. Neither removing the element from a layout nor deleting the whole space deletes it, so it stays a first-class view in the content views listing either way. Deliberate (2026-08-29): silently deleting views a user may still want is worse than leaving strays behind. `deleteSpace` briefly did delete them and no longer does. The intended fix is a prompt on space deletion asking what to do with the embedded views, rather than a silent rule in either direction.
