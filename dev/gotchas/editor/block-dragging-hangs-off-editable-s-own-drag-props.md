---
title: "Block dragging hangs off Editable's own drag props"
package: packages/editor
summary: "Wire block drag-over and drop through Editable's own props; an ancestor listener runs after Slate has inserted the drop"
paths:
  - 'packages/editor/src/RichTextEditor/RichTextEditor.tsx'
  - 'packages/editor/src/useBlockDrag.ts'
  - 'packages/editor/src/BlockGutter/**'
tags: [editor, drag-and-drop, slate]
---

# Block dragging hangs off `Editable`'s own drag props

`Editable` handles `dragover` and `drop` itself, inserting the dropped data as content at the drop point. slate-react checks the handler it was passed first and skips its own handling when that handler returns true or prevents default (`isEventHandled`), so block dragging is wired through `Editable`'s `onDragOver` and `onDrop` props rather than a listener on an ancestor — an ancestor's handler runs _after_ Slate's, by which point the content has already been inserted.

The handlers return `false` for any drag which did not start from a block handle, which is what leaves dragging selected text alone.

A trap in the gutter: preventing the default mousedown action stops a native drag ever starting, so the `preventDefault` which keeps the cursor in the editor is on the insert button rather than on the gutter as a whole.
