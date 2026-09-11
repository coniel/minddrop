---
title: 'CanvasView has no test file, so its canvas wiring is unverified'
package: data-views/canvas
summary: "CanvasView's ui/canvas prop wiring is only typechecked; build a harness before changing its selection wiring"
paths:
  - 'data-views/canvas/src/CanvasView/**'
  - 'ui/canvas/src/Canvas/**'
  - 'ui/canvas/src/CanvasProvider.tsx'
tags: [canvas, testing, wiring, selection]
---

# `CanvasView` has no test file, so its canvas wiring is unverified

`CanvasView` is the largest consumer of `ui/canvas` and has no test of its own. Everything it does with the canvas is prop wiring: `onNodesFrameChange`, `onSelectionDelete`, `selectionToolbar`, the align actions, and the persistence handlers behind them. Wiring of that shape typechecks perfectly while doing nothing at all — a callback attached to the wrong prop, never passed, or passed a stale closure looks identical to a correct one until it is run.

Several of the contracts it depends on are also easy to break from the `ui/canvas` side without anything failing here:

- group drags report through `onNodesFrameChange`, never per-node `onFrameChange` (see the ui/canvas entry) — a consumer that quietly loses this handler silently stops persisting group moves, and the nodes snap back on release
- connection selection lives in the canvas store, so the toolbar, the layer's styling and deletion all read the same state; a consumer reintroducing local selection state gets two sources of truth that disagree
- alignment reads the canvas's _registered_ frames, not the saved nodes, because only the registry carries measured auto-heights

A harness is not cheap, which is why there isn't one: it needs a collection with entries, a persisted data view, and database entry rendering, all inside a mounted `CanvasProvider`. Worth building before the next change to this file's selection wiring rather than after. The behaviour to cover is listed in the (now deleted) `canvas-selection-consumers` plan: lasso two entry nodes and drag the box, expecting one persisted update with both frames; lasso two connections and apply a style change, expecting it on both; Delete with a node selection.

Until then the mechanisms are covered one level down, in `ui/canvas`'s own tests, and the wiring is covered only by typecheck.
