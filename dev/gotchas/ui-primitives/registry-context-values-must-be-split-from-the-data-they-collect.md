---
title: 'Registry context values must be split from the data they collect'
package: ui/primitives
summary: 'Registration effects must depend on stable register/unregister callbacks, never the whole context, or they loop forever'
paths:
  - 'ui/primitives/src/SearchableMenu/**'
  - 'ui/primitives/src/Menu/MenuSearchContext.tsx'
  - 'ui/primitives/src/Menu/MenuSearchScope.tsx'
tags: [context, react, infinite-loop, searchable-menu]
---

# Registry context values must be split from the data they collect

`SearchableMenu` collects its items through a context: each `SearchableMenuItem` calls `register()` from an effect, which appends to the menu's `orderedIds` state. That state feeds `getItemNavProps`, which is part of the same context value.

Depending on the whole context object in the item's registration effect therefore loops forever: registering changes `orderedIds`, which gives the context a new identity, which re-runs the effect, which registers again. Nothing converges, because unregister/register rebuilds the array each pass even though its contents are unchanged. The main thread is pinned, so it presents as a freeze rather than a slow render — and in tests, vitest's own timeout cannot fire, so the run hangs instead of failing.

Depend on the individual `register`/`unregister` callbacks (both stable, `useCallback` with no deps) rather than the context object. The same applies to any registry-style context: keep the stable registration callbacks separate from the derived data, or split them into two contexts.

`MenuSearchScope` wraps `register` to stamp its scope onto every registration, and `registerScope` itself registers from an effect. Both wrappers must be memoized on the stable callbacks: derived from the context value they re-register everything on every render and the menu spins forever — a hang with no error, in a test as in the app.
