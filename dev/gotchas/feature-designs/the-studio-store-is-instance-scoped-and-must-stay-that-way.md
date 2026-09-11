---
title: 'The studio store is instance-scoped, and must stay that way'
package: features/designs
summary: 'Keep all studio state inside the createDesignStudioStore closure; module-level state blocks concurrent studio instances'
paths:
  - 'features/designs/src/DesignStudioStore/**'
  - 'features/designs/src/createDesignStudioCanvasStore.ts'
  - 'features/designs/src/DesignStudio/**'
tags: [studio, store, instance-scope, state]
---

# The studio store is instance-scoped, and must stay that way

`createDesignStudioStore()` returns a store instance owned by the `DesignStudio` view (paired with its own canvas store). The legacy studio used a module-level singleton, which is why the studio and spaces edit mode could never be open at once and why spaces had to reach in through a synthetic-design wrapper. Anything reaching for module state here (a debounce timer, a history stack, a cached lookup) reintroduces that limitation: keep it in the factory closure.
