import { Editor as SlateEditor } from 'slate';
import { TableRowElement } from '@minddrop/ast';
import { Transforms } from '../../Transforms';
import { Editor } from '../../types';
import { exitTableBelow } from '../exitTableBelow';
import { getTableCellEntry } from '../getTableCellEntry';
import { tableCellColumnIndex, tableCellRowIndex } from '../table-elements';

/**
 * Moves the selection to the cell below the one it is in, keeping the
 * column, or out to the block after the table from the last row.
 *
 * @param editor - An editor instance.
 * @returns Whether the selection was inside a table cell.
 */
export function selectTableCellBelow(editor: Editor): boolean {
  const cellEntry = getTableCellEntry(editor);

  // Outside a table there is nothing to move between
  if (!cellEntry) {
    return false;
  }

  const [tableNode, tablePath] = cellEntry.table;
  const rowIndex = tableCellRowIndex(cellEntry);
  const columnIndex = tableCellColumnIndex(cellEntry);

  // Within the table, move down a row keeping the column
  if (rowIndex < tableNode.children.length - 1) {
    const targetRow = tableNode.children[rowIndex + 1] as TableRowElement;
    const targetColumn = Math.min(columnIndex, targetRow.children.length - 1);

    Transforms.select(
      editor,
      SlateEditor.end(editor, [...tablePath, rowIndex + 1, targetColumn]),
    );

    return true;
  }

  // From the last row, step out to the block after the table, adding a
  // paragraph when the table ends the document
  exitTableBelow(editor, tablePath);

  return true;
}
