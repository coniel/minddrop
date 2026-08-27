import {
  Path,
  PathRef,
  Point,
  Range,
  Editor as SlateEditor,
  Element as SlateElement,
  Node as SlateNode,
} from 'slate';
import {
  Ast,
  Element,
  TableCellElement,
  TableColumnAlignment,
  TableElement,
  TableRowElement,
} from '@minddrop/ast';
import { Transforms } from '../Transforms';
import { exitTableBelow } from '../tables/exitTableBelow';
import { getTableCellEntry } from '../tables/getTableCellEntry';
import { insertTableRow } from '../tables/insertTableRow';
import { insertTableRowBelow } from '../tables/insertTableRowBelow';
import { removeTableColumn } from '../tables/removeTableColumn';
import { selectTableCellBelow } from '../tables/selectTableCellBelow';
import {
  TableCellEntry,
  generateTableCell,
  generateTableRow,
  isTableCellElement,
  isTableElement,
  isTableRowElement,
  resolvePreviousTableCellPath,
  tableCellColumnIndex,
  tableCellRowIndex,
} from '../tables/table-elements';
import { Editor } from '../types';
import {
  getContentStartIndex,
  getElementAbove,
  isBlockElement,
  isVoidElement,
} from '../utils';

// The grid a table starts with when it is built around inline content,
// beyond the header row and any columns its alignment already declares
const StarterColumns = 2;
const StarterBodyRows = 2;

/**
 * Adds the editing behaviour of tables, whose rows and cells are internal
 * structure rather than blocks of their own.
 *
 * Normalization keeps every table a rectangular grid of inline-content
 * cells: a table without rows is built into a starter grid around its
 * content, one without cells becomes a paragraph, ragged rows are padded,
 * block content inside a cell is dissolved into its text, and rows or
 * cells which escape their table are dissolved back into ordinary content.
 *
 * Breaks and deletes stay within the grid: Return and Shift-Return move
 * between rows or grow the table rather than splitting it, deletes stop at
 * cell and table boundaries instead of merging across them, pasting into a
 * cell degrades to a single line of text, and a fragment delete covering a
 * whole table removes it rather than leaving an empty husk.
 *
 * @param editor - An editor instance.
 * @returns The editor instance with the plugin behaviour applied.
 */
export function withTables(editor: Editor): Editor {
  const {
    normalizeNode,
    insertBreak,
    insertSoftBreak,
    deleteBackward,
    deleteForward,
    deleteFragment,
    insertData,
  } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    if (SlateElement.isElement(node)) {
      // Keep the table a rectangular grid
      if (isTableElement(node) && normalizeTable(editor, node, path)) {
        return;
      }

      // Dissolve rows which escaped their table
      if (isTableRowElement(node) && normalizeTableRow(editor, node, path)) {
        return;
      }

      // Dissolve cells which escaped their row, and keep cell content inline
      if (isTableCellElement(node) && normalizeTableCell(editor, node, path)) {
        return;
      }
    }

    normalizeNode(entry);
  };

  editor.insertBreak = () => {
    const cellEntry = getTableCellEntry(editor);

    // Outside a table the break belongs to the other plugins
    if (!cellEntry) {
      insertBreak();

      return;
    }

    const [tableNode, tablePath] = cellEntry.table;
    const rowIndex = tableCellRowIndex(cellEntry);

    if (rowIndex === tableNode.children.length - 1) {
      // Return on an empty last row steps out of the table rather than
      // growing it, removing the row it leaves behind
      if (
        rowIndex > 0 &&
        SlateNode.string(tableNode.children[rowIndex]) === ''
      ) {
        exitEmptyLastRow(editor, cellEntry);

        return;
      }

      // Return in the last column starts the new row at its first cell,
      // like a carriage return
      if (
        tableCellColumnIndex(cellEntry) ===
        cellEntry.row[0].children.length - 1
      ) {
        insertTableRow(editor, tablePath, rowIndex + 1);

        return;
      }

      // Anywhere else in the last row the new row keeps the column
      insertTableRowBelow(editor);

      return;
    }

    // Anywhere else it moves down a row rather than splitting the table
    selectTableCellBelow(editor);
  };

  editor.insertSoftBreak = () => {
    // Shift-Return inserts a row below the current one from anywhere in
    // the table
    if (insertTableRowBelow(editor)) {
      return;
    }

    // Outside a table the soft break belongs to the other plugins
    insertSoftBreak();
  };

  editor.deleteBackward = (unit) => {
    // Deleting a selection is an ordinary delete
    if (!editor.selection || !Range.isCollapsed(editor.selection)) {
      deleteBackward(unit);

      return;
    }

    const cellEntry = getTableCellEntry(editor);

    if (cellEntry) {
      // Anywhere but the start of the cell deletes as normal, staying
      // inside it
      if (
        !SlateEditor.isStart(editor, editor.selection.anchor, cellEntry.cell[1])
      ) {
        deleteBackward(unit);

        return;
      }

      const rowIndex = tableCellRowIndex(cellEntry);

      // Backspace in the first cell of an empty body row deletes the row,
      // stepping back to the end of the row above
      if (
        rowIndex > 0 &&
        tableCellColumnIndex(cellEntry) === 0 &&
        SlateNode.string(cellEntry.row[0]) === ''
      ) {
        deleteEmptyRow(editor, cellEntry);

        return;
      }

      // Backspace in the header of a column which is empty the whole way
      // down deletes the column, keeping the table's last one
      if (
        rowIndex === 0 &&
        cellEntry.row[0].children.length > 1 &&
        isEmptyColumn(cellEntry.table[0], tableCellColumnIndex(cellEntry))
      ) {
        deleteEmptyColumn(editor, cellEntry);

        return;
      }

      const previous = resolvePreviousTableCellPath(cellEntry);

      // Backspace at the start of a cell moves to the cell before it rather
      // than deleting, keeping the grid intact. In the first cell there is
      // nowhere to move to.
      if (previous) {
        Transforms.select(editor, SlateEditor.end(editor, previous));
      }

      return;
    }

    // Backspace at the start of the block after a table steps into its last
    // cell rather than merging the block into the table
    if (stepIntoTableBefore(editor)) {
      return;
    }

    deleteBackward(unit);
  };

  editor.deleteForward = (unit) => {
    // Deleting a selection is an ordinary delete
    if (!editor.selection || !Range.isCollapsed(editor.selection)) {
      deleteForward(unit);

      return;
    }

    const cellEntry = getTableCellEntry(editor);

    if (cellEntry) {
      // Delete stops at the end of a cell rather than pulling what follows
      // into it
      if (
        SlateEditor.isEnd(editor, editor.selection.anchor, cellEntry.cell[1])
      ) {
        return;
      }

      deleteForward(unit);

      return;
    }

    // Delete at the end of the block before a table steps into its first
    // cell rather than pulling the table apart
    if (stepIntoTableAfter(editor)) {
      return;
    }

    deleteForward(unit);
  };

  editor.deleteFragment = (options) => {
    // Deleting a fragment keeps the block its start edge sits in, so a
    // fragment beginning inside a table leaves an empty husk of it behind.
    // Tables the fragment fully covers are noted so the husk can go too.
    const coveredTables = resolveCoveredTableRefs(editor);

    deleteFragment(options);

    coveredTables.forEach((ref) => {
      const path = ref.unref();

      // The delete may have removed the table wholesale already
      if (!path || !SlateEditor.hasPath(editor, path)) {
        return;
      }

      const [node] = SlateEditor.node(editor, path);

      // Content merged into the husk from beyond the fragment is kept
      if (!isTableElement(node) || SlateNode.string(node) !== '') {
        return;
      }

      Transforms.removeNodes(editor, { at: path });
    });

    const contentStartIndex = getContentStartIndex(editor);

    // The editor always holds at least one content block, so removing a
    // husk which was the last one leaves an empty paragraph behind
    if (editor.children.length <= contentStartIndex) {
      Transforms.insertNodes(editor, Ast.generateElement('paragraph'), {
        at: [contentStartIndex],
      });
      Transforms.select(editor, SlateEditor.start(editor, [contentStartIndex]));
    }
  };

  editor.insertData = (data) => {
    // Pasting into a cell degrades to inline text, since a cell cannot hold
    // blocks
    if (getTableCellEntry(editor)) {
      const text = data.getData('text/plain');

      if (text) {
        Transforms.insertText(editor, text.replace(/\s*\n+\s*/g, ' '));
      }

      return;
    }

    insertData(data);
  };

  return editor;
}

/**
 * Returns path references to the tables the selection fully covers, which
 * a fragment delete is due to remove entirely.
 *
 * @param editor - An editor instance.
 * @returns The covered tables' path references.
 */
function resolveCoveredTableRefs(editor: Editor): PathRef[] {
  const { selection } = editor;

  // Only an expanded selection deletes a fragment
  if (!selection || Range.isCollapsed(selection)) {
    return [];
  }

  // Resolved to leaf points, since a native select-all can leave the
  // selection's edges on elements, where they compare wrongly
  const start = SlateEditor.start(editor, selection);
  const end = SlateEditor.end(editor, selection);
  const refs: PathRef[] = [];

  // Check every table the selection touches
  for (const [, path] of SlateEditor.nodes(editor, {
    at: selection,
    match: isTableElement,
  })) {
    const [tableStart, tableEnd] = Range.edges(SlateEditor.range(editor, path));

    // A table is covered when the selection reaches both of its edges
    if (!Point.isAfter(start, tableStart) && !Point.isBefore(end, tableEnd)) {
      refs.push(SlateEditor.pathRef(editor, path));
    }
  }

  return refs;
}

/**
 * Removes the empty row the cursor is in and places the cursor at the end
 * of the previous row's last cell.
 *
 * @param editor - An editor instance.
 * @param cellEntry - The cell the cursor is in.
 */
function deleteEmptyRow(editor: Editor, cellEntry: TableCellEntry): void {
  const [tableNode, tablePath] = cellEntry.table;
  const rowIndex = tableCellRowIndex(cellEntry);
  const previousRow = tableNode.children[rowIndex - 1] as TableRowElement;

  Transforms.removeNodes(editor, { at: [...tablePath, rowIndex] });

  // The cursor steps back to where the deleted row was entered from
  Transforms.select(
    editor,
    SlateEditor.end(editor, [
      ...tablePath,
      rowIndex - 1,
      previousRow.children.length - 1,
    ]),
  );
}

/**
 * Checks whether every cell in a table's column is empty.
 *
 * @param table - The table element.
 * @param columnIndex - The index of the column.
 * @returns Whether the column is empty.
 */
function isEmptyColumn(table: TableElement, columnIndex: number): boolean {
  return (table.children as TableRowElement[]).every((row) => {
    const cell = row.children[columnIndex];

    return !cell || SlateNode.string(cell) === '';
  });
}

/**
 * Removes the empty column the cursor is in and places the cursor in the
 * header cell before it.
 *
 * @param editor - An editor instance.
 * @param cellEntry - The cell the cursor is in.
 */
function deleteEmptyColumn(editor: Editor, cellEntry: TableCellEntry): void {
  const [, tablePath] = cellEntry.table;
  const columnIndex = tableCellColumnIndex(cellEntry);

  removeTableColumn(editor, tablePath, columnIndex);

  // The first column has no column before it, so its replacement takes
  // the cursor instead
  if (columnIndex === 0) {
    Transforms.select(editor, SlateEditor.start(editor, [...tablePath, 0, 0]));

    return;
  }

  // The cursor steps back to where the deleted column was entered from
  Transforms.select(
    editor,
    SlateEditor.end(editor, [...tablePath, 0, columnIndex - 1]),
  );
}

/**
 * Removes the table's empty last row and moves the cursor to the block
 * after the table, adding a paragraph when the table ends the document.
 *
 * @param editor - An editor instance.
 * @param cellEntry - The cell the cursor is in.
 */
function exitEmptyLastRow(editor: Editor, cellEntry: TableCellEntry): void {
  const [, tablePath] = cellEntry.table;

  // The empty row has served its purpose as the exit
  Transforms.removeNodes(editor, {
    at: [...tablePath, tableCellRowIndex(cellEntry)],
  });

  exitTableBelow(editor, tablePath);
}

/**
 * Moves the cursor from the start of the block after a table into the
 * table's last cell, dissolving the block when it is empty.
 *
 * @param editor - An editor instance.
 * @returns Whether the cursor was inside such a block.
 */
function stepIntoTableBefore(editor: Editor): boolean {
  const entry = getElementAbove(editor);

  if (!entry || !editor.selection) {
    return false;
  }

  const [element, path] = entry;

  // Only a top level block sits beside a table
  if (path.length !== 1) {
    return false;
  }

  // A contained block steps out of its containers first, which is the
  // frame plugin's to handle
  if ((element.ancestry || []).length) {
    return false;
  }

  // Only the very start of the block would merge backwards
  if (!SlateEditor.isStart(editor, editor.selection.anchor, path)) {
    return false;
  }

  const previous = path[0] > 0 ? editor.children[path[0] - 1] : null;

  if (!previous || !isTableElement(previous)) {
    return false;
  }

  const lastRowIndex = previous.children.length - 1;
  const lastRow = previous.children[lastRowIndex] as TableRowElement;
  const lastCellPath = [path[0] - 1, lastRowIndex, lastRow.children.length - 1];

  // An empty block dissolves into the step, matching what merging would
  // have left behind
  if (Ast.toPlainText([element]) === '') {
    Transforms.removeNodes(editor, { at: path });
  }

  Transforms.select(editor, SlateEditor.end(editor, lastCellPath));

  return true;
}

/**
 * Moves the cursor from the end of the block before a table into the
 * table's first cell, dissolving the block when it is empty.
 *
 * @param editor - An editor instance.
 * @returns Whether the cursor was inside such a block.
 */
function stepIntoTableAfter(editor: Editor): boolean {
  const entry = getElementAbove(editor);

  if (!entry || !editor.selection) {
    return false;
  }

  const [element, path] = entry;

  // Only a top level block sits beside a table
  if (path.length !== 1) {
    return false;
  }

  // Only the very end of the block would merge forwards
  if (!SlateEditor.isEnd(editor, editor.selection.anchor, path)) {
    return false;
  }

  const next = editor.children[path[0] + 1];

  if (!next || !isTableElement(next)) {
    return false;
  }

  // An empty block dissolves into the step, which shifts the table into
  // its place
  const dissolve = Ast.toPlainText([element]) === '';
  const tableIndex = dissolve ? path[0] : path[0] + 1;

  if (dissolve) {
    Transforms.removeNodes(editor, { at: path });
  }

  Transforms.select(editor, SlateEditor.start(editor, [tableIndex, 0, 0]));

  return true;
}

/**
 * Keeps a table a rectangular grid: a table without rows is built into a
 * starter grid, stray non-row children are given rows of their own, ragged
 * rows are padded to the widest row, and the alignment is sized to the
 * column count.
 *
 * @param editor - An editor instance.
 * @param table - The table element.
 * @param path - The table's path.
 * @returns Whether anything was normalized.
 */
function normalizeTable(
  editor: Editor,
  table: TableElement,
  path: Path,
): boolean {
  const rows = table.children.filter(isTableRowElement);

  // A table which has no rows is rebuilt as a starter grid around whatever
  // content it holds, which is how a block converted into a table gets its
  // grid
  if (!rows.length) {
    buildStarterGrid(editor, table, path);

    return true;
  }

  // A table whose rows have lost every cell has nothing left to be a grid
  // of, and becomes a paragraph
  const cellCount = rows.reduce(
    (total, row) => total + row.children.filter(isTableCellElement).length,
    0,
  );

  if (!cellCount) {
    Transforms.setNodes<Element>(editor, { type: 'paragraph' }, { at: path });

    return true;
  }

  // A stray child which is not a row is given a cell and row of its own
  const strayIndex = table.children.findIndex(
    (child) => !isTableRowElement(child),
  );

  if (strayIndex !== -1) {
    SlateEditor.withoutNormalizing(editor, () => {
      Transforms.wrapNodes(
        editor,
        Ast.generateElement<TableCellElement>('table-cell', { children: [] }),
        { at: [...path, strayIndex] },
      );
      Transforms.wrapNodes(
        editor,
        Ast.generateElement<TableRowElement>('table-row', { children: [] }),
        { at: [...path, strayIndex] },
      );
    });

    return true;
  }

  // Every row is padded to the widest row's cell count
  const columns = Math.max(...rows.map((row) => row.children.length));
  const ragged = rows.some((row) => row.children.length < columns);

  if (ragged) {
    SlateEditor.withoutNormalizing(editor, () => {
      rows.forEach((row, rowIndex) => {
        for (let column = row.children.length; column < columns; column += 1) {
          Transforms.insertNodes(editor, generateTableCell(), {
            at: [...path, rowIndex, column],
          });
        }
      });
    });

    return true;
  }

  // The alignment mirrors the column count
  if ((table.align || []).length !== columns) {
    Transforms.setNodes<TableElement>(
      editor,
      { align: resizeAlignment(table.align, columns) },
      { at: path },
    );

    return true;
  }

  return false;
}

/**
 * Dissolves a row which sits outside a table.
 *
 * @param editor - An editor instance.
 * @param row - The row element.
 * @param path - The row's path.
 * @returns Whether anything was normalized.
 */
function normalizeTableRow(
  editor: Editor,
  row: TableRowElement,
  path: Path,
): boolean {
  const [parent] = SlateEditor.parent(editor, path);

  // A row inside its table is where it belongs
  if (SlateElement.isElement(parent) && isTableElement(parent)) {
    return false;
  }

  // At the document's top level the row becomes a paragraph, its cells left
  // for the cell rule to dissolve
  if (!SlateElement.isElement(parent)) {
    Transforms.setNodes<Element>(editor, { type: 'paragraph' }, { at: path });

    return true;
  }

  // Anywhere else the row dissolves into its parent
  Transforms.unwrapNodes(editor, { at: path });

  return true;
}

/**
 * Dissolves a cell which sits outside a row, and dissolves block content
 * inside a cell into its text since cells hold inline content only.
 *
 * @param editor - An editor instance.
 * @param cell - The cell element.
 * @param path - The cell's path.
 * @returns Whether anything was normalized.
 */
function normalizeTableCell(
  editor: Editor,
  cell: TableCellElement,
  path: Path,
): boolean {
  const [parent] = SlateEditor.parent(editor, path);

  // At the document's top level the cell becomes a paragraph
  if (!SlateElement.isElement(parent)) {
    Transforms.setNodes<Element>(editor, { type: 'paragraph' }, { at: path });

    return true;
  }

  // A cell outside a row dissolves into its parent
  if (!isTableRowElement(parent)) {
    Transforms.unwrapNodes(editor, { at: path });

    return true;
  }

  // A block inside a cell dissolves into its content, since a cell cannot
  // hold one
  const blockIndex = cell.children.findIndex(
    (child) => SlateElement.isElement(child) && isBlockElement(child.type),
  );

  if (blockIndex !== -1) {
    const block = cell.children[blockIndex] as Element;

    // A void block has no content to keep
    if (isVoidElement(block.type)) {
      Transforms.removeNodes(editor, { at: [...path, blockIndex] });
    } else {
      Transforms.unwrapNodes(editor, { at: [...path, blockIndex] });
    }

    return true;
  }

  return false;
}

/**
 * Builds a table's starter grid around its inline content, which becomes
 * the first header cell.
 *
 * @param editor - An editor instance.
 * @param table - The table element.
 * @param path - The table's path.
 */
function buildStarterGrid(
  editor: Editor,
  table: TableElement,
  path: Path,
): void {
  // Columns follow the alignment the conversion declared, or the starter
  // width
  const columns = Math.max((table.align || []).length, StarterColumns);

  SlateEditor.withoutNormalizing(editor, () => {
    // Gather the table's content into what becomes the first header cell
    Transforms.wrapNodes(
      editor,
      Ast.generateElement<TableCellElement>('table-cell', { children: [] }),
      {
        at: path,
        match: (node, nodePath) => nodePath.length === path.length + 1,
      },
    );

    // Wrap the cell into the header row
    Transforms.wrapNodes(
      editor,
      Ast.generateElement<TableRowElement>('table-row', { children: [] }),
      {
        at: path,
        match: (node, nodePath) => nodePath.length === path.length + 1,
      },
    );

    // Fill the header row out to the full column count
    for (let column = 1; column < columns; column += 1) {
      Transforms.insertNodes(editor, generateTableCell(), {
        at: [...path, 0, column],
      });
    }

    // Add the starter body rows
    for (let row = 1; row <= StarterBodyRows; row += 1) {
      Transforms.insertNodes(editor, generateTableRow(columns), {
        at: [...path, row],
      });
    }

    // Size the alignment to the columns
    if ((table.align || []).length !== columns) {
      Transforms.setNodes<TableElement>(
        editor,
        { align: resizeAlignment(table.align, columns) },
        { at: path },
      );
    }
  });
}

/**
 * Resizes a table's alignment to its column count, keeping what it
 * declares and defaulting new columns to no alignment.
 *
 * @param align - The table's alignment.
 * @param columns - The column count.
 * @returns The resized alignment.
 */
function resizeAlignment(
  align: TableColumnAlignment[] | undefined,
  columns: number,
): TableColumnAlignment[] {
  return Array.from({ length: columns }, (unused, index) =>
    align && index < align.length ? align[index] : null,
  );
}
