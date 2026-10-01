---
title: "CanvasView's selection wiring is unverified"
package: content-views/canvas
summary: "CanvasView's tests cover only the add content picker; its ui/canvas selection wiring is only typechecked, so extend the harness before changing it"
paths:
  - 'content-views/canvas/src/CanvasView/**'
  - 'ui/canvas/src/Canvas/**'
  - 'ui/canvas/src/CanvasProvider.tsx'
tags: [canvas, testing, wiring, selection]
---

# `CanvasView`'s selection wiring is unverified

`CanvasView` is the largest consumer of `ui/canvas`. Its test file covers only the add content picker: dropping the card, picking or creating an entry, and the shift-pick. Everything else it does with the canvas is prop wiring with no test: `onNodesFrameChange`, `onSelectionDelete`, `selectionToolbar`, the align actions, and the persistence handlers behind them. Wiring of that shape typechecks perfectly while doing nothing at all — a callback attached to the wrong prop, never passed, or passed a stale closure looks identical to a correct one until it is run.

Several of the contracts it depends on are also easy to break from the `ui/canvas` side without anything failing here:

- group drags report through `onNodesFrameChange`, never per-node `onFrameChange` (see the ui/canvas entry) — a consumer that quietly loses this handler silently stops persisting group moves, and the nodes snap back on release
- connection selection lives in the canvas store, so the toolbar, the layer's styling and deletion all read the same state; a consumer reintroducing local selection state gets two sources of truth that disagree
- alignment reads the canvas's _registered_ frames, not the saved nodes, because only the registry carries measured auto-heights

The harness exists: `src/test-utils.ts` loads the workspace, database, collection and content view fixtures, and `CanvasView.test.tsx` renders `CanvasViewComponent` (which mounts its own `CanvasProvider`) on an empty collection. Extend it before the next change to this file's selection wiring rather than after. The behaviour to cover is listed in the (now deleted) `canvas-selection-consumers` plan: lasso two entry nodes and drag the box, expecting one persisted update with both frames; lasso two connections and apply a style change, expecting it on both; Delete with a node selection.

Until then the mechanisms are covered one level down, in `ui/canvas`'s own tests, and the selection wiring is covered only by typecheck.
