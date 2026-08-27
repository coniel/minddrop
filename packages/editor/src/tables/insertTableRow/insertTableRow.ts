import { Path, Editor as SlateEditor } from 'slate';
import { Transforms } from '../../Transforms';
import { generateTableRow, isTableElement } from '../table-elements';

/**
 * Inserts an empty row into a table and places the cursor in its first
 * cell.
 *
 * @param editor - An editor instance.
 * @param tablePath - The table's path.
 * @param rowIndex - The index at which to insert the row.
 */
export function insertTableRow(
  editor: SlateEditor,
  tablePath: Path,
  rowIndex: number,
): void {
  const [table] = SlateEditor.node(editor, tablePath);

  // Only a table has rows to add to
  if (!isTableElement(table)) {
    return;
  }

  // Insert a row matching the table's column count
  Transforms.insertNodes(editor, generateTableRow(table.align.length), {
    at: [...tablePath, rowIndex],
  });

  // Place the cursor in the new row's first cell
  Transforms.select(
    editor,
    SlateEditor.start(editor, [...tablePath, rowIndex, 0]),
  );
}
