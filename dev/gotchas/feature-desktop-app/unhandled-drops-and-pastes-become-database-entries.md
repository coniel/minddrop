---
title: 'Unhandled drops and pastes become database entries'
package: features/desktop-app
summary: 'Window listeners import any drop or paste not already handled; a component taking native drops or pastes itself must call preventDefault, or the content is imported as well.'
paths:
  - 'features/desktop-app/src/initializeDesktopApp/initializeDropAndPaste.ts'
  - 'packages/drag-and-drop/src/useDroppable/**'
tags: [drop, paste, clipboard, databases]
---

# Unhandled drops and pastes become database entries

`initializeDropAndPaste` registers window `drop` and `paste` listeners which add the transferred content to the databases configured under Settings > Databases. They skip an event whose `defaultPrevented` is set, and one whose target is an editable element (an input, a textarea, a contenteditable such as the editor).

Anything else counts as unhandled and is imported. A component handling a native drop or a paste itself has to call `event.preventDefault()`, as `useDroppable` does for an accepted native drop, or the same files, URL or text also become entries in the default databases.

The `dragover` listener allows the drop everywhere, so a droppable never needs to allow it on the window's behalf.
