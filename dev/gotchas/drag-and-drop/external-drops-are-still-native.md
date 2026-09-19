---
title: 'External drops are still native'
package: packages/drag-and-drop
summary: 'Drags from outside the app (files, URLs, text, Slate text drags) arrive through the native drag events useDroppable still handles; they carry origin null and are matched on their data types alone'
paths:
  - 'packages/drag-and-drop/src/useDroppable/**'
  - 'packages/drag-and-drop/src/utils/dragContainsType/**'
  - 'ui/primitives/src/initializePointerDownRecovery/**'
tags: [drag-and-drop, native, files, external]
---

# External drops are still native

Only drags started inside the app run on the pointer engine. Files, URLs and text dragged in from other apps, and Slate's own drag of selected editor text, are native HTML5 drags: no pointer events reach the page while they last, and the engine knows nothing of them.

`useDroppable` keeps the native `dragover` / `dragenter` / `dragleave` / `drop` handlers for them. They reach `onDrop` in the same `DropEventData` shape as an engine drop, with the differences a handler has to allow for:

- `origin` is `null`. A handler branching on where the drag started treats a native drop as coming from nowhere.
- Acceptance is matched on the transfer's types alone (`dragContainsType`), since a native drag's data is unreadable until it drops. `accepts` entries name MindDrop data keys or raw MIME types, and `'Files'` for a file drop.
- The files are under `data.files`, parsed by `parseTransferData` the same way an engine drag's payload is.
- Nothing marks the document with `data-dragging`, the drag layer shows nothing, and `DragAndDrop.useIsDragging` is false throughout.

A native drag also reproduces WebKit's withheld `pointerdown` on the press after it, which is why `initializePointerDownRecovery` stays.
