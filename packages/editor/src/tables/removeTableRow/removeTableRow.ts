import { Path, Editor as SlateEditor } from 'slate';
import { Transforms } from '../../Transforms';
import { isTableElement } from '../table-elements';

/**
 * Removes a row from a table. Removing the only row removes the table
 * itself, since a table cannot be empty.
 *
 * @param editor - An editor instance.
 * @param tablePath - The table's path.
 * @param rowIndex - The index of the row to remove.
 */
export function removeTableRow(
  editor: SlateEditor,
  tablePath: Path,
  rowIndex: number,
): void {
  const [table] = SlateEditor.node(editor, tablePath);

  // Only a table has rows to remove
  if (!isTableElement(table)) {
    return;
  }

  // Removing the only row leaves nothing to be a table
  if (table.children.length === 1) {
    Transforms.removeNodes(editor, { at: tablePath });

    return;
  }

  Transforms.removeNodes(editor, { at: [...tablePath, rowIndex] });
}
