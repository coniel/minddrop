---
title: 'WebKit will not drag an unselectable element'
package: packages/editor
summary: 'Drag handles need user-select: auto and -webkit-user-drag: element in CSS or they are inert in WKWebView'
paths:
  - 'packages/editor/src/BlockGutter/BlockGutter.css'
  - 'packages/editor/src/BlockGutter/BlockGutter.tsx'
  - 'packages/editor/src/useBlockDrag.ts'
tags: [editor, drag-and-drop, webkit, css]
---

# WebKit will not drag an unselectable element

The app runs in WKWebView, where `draggable` on its own is not enough. A drag handle also needs, in CSS:

- `user-select: auto` — WebKit refuses to start a drag on an element which cannot be selected, and drag handles commonly sit inside chrome which sets `user-select: none`. This alone made the block drag handle completely inert.
- `-webkit-user-drag: element` — WebKit starts drags on elements which are neither links nor images only once they are marked draggable in CSS too.

Both are no-ops in Chromium, so a handle which works in a browser can still be dead in the app. Neither is testable in jsdom, which has no drag machinery at all, so the tests around a drag source prove the handlers are wired up and nothing more.

Also worth knowing: an exception thrown inside a `dragstart` handler cancels the drag silently, which looks identical to the CSS problem above.

The drag itself goes through `useDraggable`, which serializes the app's selection onto the dataTransfer, so blocks can be dropped on anything in the app which accepts them rather than only back into their own editor.
