# Drag and drop

How a drag runs, from registering a draggable or a drop target to the drop
landing. The engine is the core package `@minddrop/drag-and-drop`
(namespace `DragAndDrop`); the preview layer lives in `ui/drag-and-drop`;
`@minddrop/selection` wraps the draggable hook for selection items.

## Why a pointer engine

Drags within the app run on pointer events rather than native HTML5 drag
and drop. Native drags freeze `:hover` and `:active` for their duration,
hide the payload from targets until the drop, cannot animate a lift or a
settle, and never fire `dragend` when the drop unmounts the source. Drops
from outside the app (OS files, URLs, text) still arrive natively; see
"External drops" below.

## Registration

`DragAndDrop.useDraggable({ id, type, data, origin?, effect?, preview?,
disabled?, onActivate? })` returns `{ draggableProps, isDragging, ref }`.
Spreading `draggableProps` onto an element registers it in the draggables
registry under a key from `useId` and unregisters it when the element
unmounts. The props carry the ref callback, `data-draggable-key`,
`draggable: false`, and the pointer, mouse and drag start handlers.

`DragAndDrop.useDroppable({ type, id, index?, isLastChild?, accepts?,
claim?, directOnly?, axis?, enableInside?, edgeThreshold?, onDrop?,
onDragMove? })` returns `{ droppableProps, isDraggingOver,
dropIndicatorPosition, ref }`. Spreading `droppableProps` registers the
element in the droppables registry the same way. The entry holds a
`notify` callback the engine pushes over state through, so the hook's
local state re-renders only the target concerned.

Both registries are plain maps keyed by hook instance. An entry reads the
hook's latest options through a ref at event time, so option changes never
need a re-registration and callbacks never go stale.

`Selection.useDraggable(item, options)` wraps the engine hook: its
`onActivate` selects the item (or adds it with Shift, or updates it in
place when already selected) and its `data` is the serialized selection.

An element which is both dragged and dropped on composes the two ref
callbacks with `composeRefs` from `@minddrop/utils`.

## From press to drag

1. `pointerdown` arms the press unless the draggable is disabled, the
   button is not the primary one, the target is a text entry control,
   sits inside `[data-no-drag]`, or an inner draggable already claimed the
   press (the innermost draggable takes it). `mousedown` is default
   prevented on an armed press so the browser does not anchor a text
   selection the drag would then extend.
2. Window `pointermove` listeners measure the distance from the press.
   Under the package's `DRAG_THRESHOLD` (4px) nothing happens and a
   release stays a click.
3. Past the threshold the hook calls `onActivate(press)`, resolves `data`
   and `preview` (either may be a function), and calls `startDrag`.
4. `startDrag` refuses while a drag is active. Otherwise it builds the
   `ActiveDrag` (`id`, `type`, `types`, `data`, `origin`, `effect`,
   `sourceRect`, `token`), opens the drag session (the preview element,
   the over list, and window listeners for move, release, Escape and a
   native drag taking over), marks `html[data-dragging]`, records the
   pointer position, sets the drag store, dispatches
   `drag-and-drop:started`, and runs the first move.
5. The drag layer subscribes to the store directly, so it runs
   synchronously as the drag becomes active, before React re-renders the
   source as dragging. It clones the preview element while the source
   still looks as it did, mounts the clone in a fixed layer above
   everything, and moves it with the pointer through
   `DragAndDrop.subscribeToMove`.

Sources read `isDragging` from the store by comparing the active drag's
`token` with the one they captured when they started it, so a second
element rendering the same item does not report itself dragged.

## While dragging

Every `pointermove` calls `updateDrag(clientX, clientY)`, which:

1. Records the pointer position and notifies the move subscribers (the
   layer).
2. Hit tests with `document.elementFromPoint` and walks up through
   `[data-droppable-key]` ancestors to build the over list, innermost
   first. A target is skipped when its `accepts` matches none of the
   drag's `types`, or when it is `directOnly` and the pointer is over one
   of its descendants. The walk stops at a target which claims the drag,
   which every target does unless it sets `claim: false`.
3. Notifies targets the drag has left that it is no longer over them, and
   notifies the targets it is over with the drop position resolved from
   the pointer's place within them (`axis`, `enableInside`,
   `edgeThreshold`, `isLastChild`) and the indicator position that
   follows from it.
4. Calls `onDragMove` on each target it is over with the pointer position,
   the hit element and the drop position.
5. Resolves auto-scroll. The candidates are every scroll container the
   drag has been over, starting with those around its source, with the
   ones around the hit element first. Per axis, the innermost candidate
   which can still scroll in the pointer's
   direction scrolls at a velocity ramping up with the pointer's depth
   into its edge zone. A candidate scrolls along an axis however far the
   pointer has overshot its edge, as long as the pointer is within its
   span on the other axis, so a pointer which runs off the board it is
   dragging in keeps scrolling it at full speed. A frame loop applies the
   scroll and re-runs the move at the same pointer position, so targets
   sliding under the pointer are re-hit.

`html[data-dragging]` is set for the whole drag. The theme's base styles
override every element's cursor and selectability under it, and tooltips
refuse to open while it is set.

## Release

1. `pointerup` runs a final move at the release point and calls
   `endDrag(true)`. Escape, a native drag taking over the session, or a
   move arriving with no button held (a release outside the window) call
   `endDrag(false)`.
2. `endDrag` takes the innermost target in the over list, closes the
   session and its listeners, and stops the auto-scroll loop.
3. A release over a target calls that target's `onDrop` with
   `DropEventData`: `targetType`, `targetId`, `index`, `position`, `data`,
   `origin`, `clientX` and `clientY`. No other target's `onDrop` is
   called, whether or not the innermost one claims the drag. Claiming
   only governs the over state of ancestors.
4. Then, in order: the store is cleared, `data-dragging` is removed, the
   targets still over are notified the drag left, the trailing click the
   release fires is swallowed, and `drag-and-drop:ended` is dispatched
   with `{ drag, dropped }`.
5. The layer hears the ended event. A dropped drag settles the clone onto
   the nearest element registered under the same draggable `id`, waiting a
   few frames for the dropped item to render where it landed, and fades it
   out in place when nothing renders it. A copied item's source does not
   count, since it stays as it was. A cancelled drag animates the
   clone back to the source rect. Either way the clone is removed after.

The drop handler runs before the drag state clears, so anything it does
which reads `DragAndDrop.getActiveDrag()` still sees the drag.

## Move and copy

`effect` on a draggable is `'move'` (the default) or `'copy'`. The engine
does nothing with it beyond carrying it on the `ActiveDrag`; sources read
it to decide whether to collapse or hide themselves in place. An item
dragged out of one of the app's own sidebar groups is a copy, so the group
keeps listing it.

## Origin

`origin` on a draggable is `{ type, id }` naming where the drag started.
Drop targets read it off the drop to tell a reorder within their own
container from a move in from elsewhere. External drops have
`origin: null`.

## External drops

OS files, URLs and text never enter the pointer path. They arrive as native
`dragover`, `dragenter`, `dragleave` and `drop` events on the droppable's
own handlers, which:

- check `accepts` against `dataTransfer.types` (a native drag exposes its
  types but not its data until the drop),
- stop propagation when claiming so the targets around do not react,
- report the same over state and indicator position, and
- build the same `DropEventData` on drop, with the data parsed by
  `parseTransferData` and `origin: null`.

A `dropCapture` handler on every target clears its own over state as any
drop within it begins, since a drop taken by a nested target never
propagates to the ancestor's drop handler.

## Testing

`@minddrop/drag-and-drop/test-utils` provides gesture utils which drive the
engine through the same window listeners the app uses: `dragOver(source,
target, options?)` leaves a drag in progress over the target,
`releaseDrag(options?)` drops it, `dragAndDrop(source, target, options?)`
does both, and `cancelDragWithEscape()` cancels it. Hit testing resolves to
the target wherever the pointer is, and a zero-size target is measured at a
default rect so a drop position can still be read off the pointer.
`DragSource` renders a draggable with given data for tests of drop targets,
and `DragFixtures.activeDrag_1` is a ready `ActiveDrag`.

Gotchas for the package live in `dev/gotchas/drag-and-drop/`.
