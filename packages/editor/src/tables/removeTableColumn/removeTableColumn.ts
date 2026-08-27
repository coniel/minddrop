import { Path, Editor as SlateEditor } from 'slate';
import { TableColumnAlignment, TableElement } from '@minddrop/ast';
import { Transforms } from '../../Transforms';
import { isTableElement } from '../table-elements';

/**
 * Removes a column from a table. Removing the only column removes the
 * table itself, since a table cannot be empty.
 *
 * @param editor - An editor instance.
 * @param tablePath - The table's path.
 * @param columnIndex - The index of the column to remove.
 */
export function removeTableColumn(
  editor: SlateEditor,
  tablePath: Path,
  columnIndex: number,
): void {
  const [table] = SlateEditor.node(editor, tablePath);

  // Only a table has columns to remove
  if (!isTableElement(table)) {
    return;
  }

  // Removing the only column leaves nothing to be a table
  if (table.align.length === 1) {
    Transforms.removeNodes(editor, { at: tablePath });

    return;
  }

  SlateEditor.withoutNormalizing(editor, () => {
    // Take the column's cell out of every row
    table.children.forEach((row, rowIndex) => {
      Transforms.removeNodes(editor, {
        at: [...tablePath, rowIndex, columnIndex],
      });
    });

    // Drop the column's alignment along with it
    const align: TableColumnAlignment[] = [...table.align];

    align.splice(columnIndex, 1);

    Transforms.setNodes<TableElement>(editor, { align }, { at: tablePath });
  });
}
