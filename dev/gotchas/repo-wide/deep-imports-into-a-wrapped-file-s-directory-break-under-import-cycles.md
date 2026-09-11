---
title: "Deep imports into a wrapped file's directory break under import cycles"
package: repo
summary: "Import sibling components through the parent barrel (../Menu), never a wrapped file's directory, or cycles yield undefined"
paths:
  - 'ui/primitives/src/Menu/MenuItem/**'
  - 'ui/primitives/src/Menu/index.ts'
  - '**/index.ts'
tags: [barrels, imports, cycles, vitest]
---

# Deep imports into a wrapped file's directory break under import cycles

Vitest's module transform hoists a module's own export definitions to the top of the module, so a file entered part way through an import cycle still exposes its export keys, and a barrel's `export *` over it copies them fine. A barrel `index.ts` gets its keys only once its `export *` runs, though, so a barrel entered part way through a cycle is copied as empty by any parent `export *`. That is exactly what a deep import like `'../Menu/MenuItem'` does once `MenuItem` is wrapped in a directory: the cycle enters through the new barrel, the `Menu` barrel then copies nothing from it, and every consumer of `@minddrop/ui-primitives` gets `MenuItem` as `undefined` (React's "Element type is invalid" error). Import sibling components through their parent's barrel (`'../Menu'`) rather than reaching into a component's directory.
