---
title: "The diff editor's models outlive the editor on purpose"
package: apps/dev-tools
summary: 'Keep keepCurrentOriginalModel/keepCurrentModifiedModel on DiffViewer; it disposes Monaco models itself to avoid unmount errors'
paths:
  - 'apps/dev-tools/src/renderer/DiffViewer.tsx'
tags: [monaco, diff-editor, disposal, react]
---

# The diff editor's models outlive the editor on purpose

`@monaco-editor/react` disposes a `DiffEditor`'s text models before the editor itself, which Monaco reports as "TextModel got disposed before DiffEditorWidget model got reset" on every unmount. `DiffViewer` passes `keepCurrentOriginalModel` and `keepCurrentModifiedModel` so the wrapper leaves the models alone, then resets and disposes them itself once the view unmounts. Dropping those props brings the error back.
