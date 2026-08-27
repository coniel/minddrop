import { Path, Editor as SlateEditor } from 'slate';
import { TableRowElement } from '@minddrop/ast';
import { Transforms } from '../../Transforms';
import { Editor } from '../../types';
import { getTableCellEntry } from '../getTableCellEntry';
import { tableCellColumnIndex, tableCellRowIndex } from '../table-elements';

/**
 * Moves the selection to the cell above the one it is in, keeping the
 * column, or out to the block before the table from the header row.
 *
 * @param editor - An editor instance.
 * @returns Whether the selection was inside a table cell.
 */
export function selectTableCellAbove(editor: Editor): boolean {
  const cellEntry = getTableCellEntry(editor);

  // Outside a table there is nothing to move between
  if (!cellEntry) {
    return false;
  }

  const [tableNode, tablePath] = cellEntry.table;
  const rowIndex = tableCellRowIndex(cellEntry);
  const columnIndex = tableCellColumnIndex(cellEntry);

  // Within the table, move up a row keeping the column
  if (rowIndex > 0) {
    const targetRow = tableNode.children[rowIndex - 1] as TableRowElement;
    const targetColumn = Math.min(columnIndex, targetRow.children.length - 1);

    Transforms.select(
      editor,
      SlateEditor.end(editor, [...tablePath, rowIndex - 1, targetColumn]),
    );

    return true;
  }

  // The table starts the document, leaving nowhere above to move to
  if (tablePath[tablePath.length - 1] === 0) {
    return true;
  }

  // From the header row, step out to the block before the table
  Transforms.select(editor, SlateEditor.end(editor, Path.previous(tablePath)));

  return true;
}
