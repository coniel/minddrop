---
title: 'Tables are the one block with nested node structure'
package: packages/editor
summary: 'Tables nest row and cell nodes; editor code that walks blocks or handles key input needs a table guard'
paths:
  - 'packages/editor/src/withTables/**'
  - 'packages/editor/src/tables/**'
  - 'packages/editor/src/default-element-configs/TableElement/**'
  - 'packages/editor/src/withBlockShortcuts/**'
tags: [editor, tables, normalization, slate]
---

# Tables are the one block with nested node structure

Every other block is flat (containers are ancestry frames), but a `table` block holds `table-row` nodes holding `table-cell` nodes. Everything which assumes "block = top level node with inline children" must exclude the table's internals: block shortcuts and the slash menu are guarded to top level blocks / non-cell positions, and `withTables` intercepts Enter, Backspace, Delete and paste inside tables before the frame and reset plugins see them. New editor behaviour which walks blocks or reacts to key input should check whether it needs a table guard.

`withTables` normalization repairs any table shape: a rowless table is rebuilt as a starter grid around its inline content (this is what the `| ` shortcut and menu conversion rely on, since `setNodes` cannot replace children), ragged rows are padded, and blocks inside cells or rows/cells outside tables are dissolved.

Deferred from the plan: the slash menu inserts a fixed three column starter rather than offering a size picker, and edited tables re-serialize with the normalized `| --- |` delimiter spelling rather than matching the document's dominant style (untouched tables keep their spelling verbatim through their source slice).
