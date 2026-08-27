import { Path, Editor as SlateEditor } from 'slate';
import { TableColumnAlignment, TableElement } from '@minddrop/ast';
import { Transforms } from '../../Transforms';
import { generateTableCell, isTableElement } from '../table-elements';

/**
 * Inserts an empty column into a table and places the cursor in its header
 * cell.
 *
 * @param editor - An editor instance.
 * @param tablePath - The table's path.
 * @param columnIndex - The index at which to insert the column.
 */
export function insertTableColumn(
  editor: SlateEditor,
  tablePath: Path,
  columnIndex: number,
): void {
  const [table] = SlateEditor.node(editor, tablePath);

  // Only a table has columns to add to
  if (!isTableElement(table)) {
    return;
  }

  SlateEditor.withoutNormalizing(editor, () => {
    // Give every row a cell at the new column
    table.children.forEach((row, rowIndex) => {
      Transforms.insertNodes(editor, generateTableCell(), {
        at: [...tablePath, rowIndex, columnIndex],
      });
    });

    // The new column starts without an alignment
    const align: TableColumnAlignment[] = [...table.align];

    align.splice(columnIndex, 0, null);

    Transforms.setNodes<TableElement>(editor, { align }, { at: tablePath });
  });

  // Place the cursor in the new column's header cell
  Transforms.select(
    editor,
    SlateEditor.start(editor, [...tablePath, 0, columnIndex]),
  );
}
