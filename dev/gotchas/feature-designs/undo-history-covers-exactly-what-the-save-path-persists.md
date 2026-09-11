---
title: 'Undo history covers exactly what the save path persists'
package: features/designs
summary: 'Studio undo snapshots hold only layouts and elementsByLayout; widen the save path before widening history'
paths:
  - 'features/designs/src/DesignStudioStore/DesignStudioStore.ts'
  - 'features/designs/src/DesignStudioStore/history.test.ts'
  - 'features/designs/src/DesignStudioStore/save.test.ts'
tags: [undo, history, studio, persistence]
---

# Undo history covers exactly what the save path persists

Snapshots hold `layouts` + `elementsByLayout`, not the whole design. Property and name edits persist through their own API calls (`Designs.addProperty`, `Designs.update`), while the save path writes only `{ layouts }` — so snapshotting the full design would let an undo revert a property in the store while disk kept it, and the property would reappear on reload. Widening history means widening the save path first.
