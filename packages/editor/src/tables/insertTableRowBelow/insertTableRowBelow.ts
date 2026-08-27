import { Editor as SlateEditor } from 'slate';
import { Transforms } from '../../Transforms';
import { Editor } from '../../types';
import { getTableCellEntry } from '../getTableCellEntry';
import { insertTableRow } from '../insertTableRow';
import { tableCellColumnIndex, tableCellRowIndex } from '../table-elements';

/**
 * Inserts a row below the one the selection is in and places the cursor in
 * the new row's cell in the same column.
 *
 * @param editor - An editor instance.
 * @returns Whether the selection was inside a table cell.
 */
export function insertTableRowBelow(editor: Editor): boolean {
  const cellEntry = getTableCellEntry(editor);

  // Outside a table there is no row to insert below
  if (!cellEntry) {
    return false;
  }

  const [, tablePath] = cellEntry.table;
  const rowIndex = tableCellRowIndex(cellEntry);
  const columnIndex = tableCellColumnIndex(cellEntry);

  insertTableRow(editor, tablePath, rowIndex + 1);

  // Keep the cursor in its column rather than the first cell the
  // insertion selects
  Transforms.select(
    editor,
    SlateEditor.start(editor, [...tablePath, rowIndex + 1, columnIndex]),
  );

  return true;
}
