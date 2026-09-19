---
title: 'The drag registries are plain maps'
package: packages/drag-and-drop
summary: 'DroppablesRegistry and DraggablesRegistry are module-level maps rather than createRegistry stores, since hundreds of drop targets register on mount and are read on every pointer move; do not move them onto a store'
paths:
  - 'packages/drag-and-drop/src/DroppablesRegistry.ts'
  - 'packages/drag-and-drop/src/DraggablesRegistry.ts'
tags: [drag-and-drop, registry, performance]
---

# The drag registries are plain maps

`DroppablesRegistry` and `DraggablesRegistry` look like `createRegistry` from `@minddrop/stores` and are not built on it on purpose. A `createRegistry` registry is an object store: every registration writes it, every subscriber of it re-renders, and it shows in the dev tools store inspector.

Every card in a view and every row in the sidebar registers a drop target on mount and unregisters on unmount, and the engine looks entries up on every pointer move of a drag. Those writes and reads have to cost nothing, and nothing renders from the registries: a target's own over state reaches it through the `notify` callback on its entry, not through a selector. So the registries are maps behind a `register` / `unregister` / `get` / `getAll` / `clear` object, and the engine's only rendered state is the active drag in `DragStore`.
