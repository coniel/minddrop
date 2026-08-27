import { Path, Editor as SlateEditor } from 'slate';
import { TableColumnAlignment, TableElement } from '@minddrop/ast';
import { Transforms } from '../../Transforms';
import { isTableElement } from '../table-elements';

/**
 * Sets the alignment of a table column.
 *
 * @param editor - An editor instance.
 * @param tablePath - The table's path.
 * @param columnIndex - The index of the column.
 * @param alignment - The alignment to set, or null for none.
 */
export function setTableColumnAlignment(
  editor: SlateEditor,
  tablePath: Path,
  columnIndex: number,
  alignment: TableColumnAlignment,
): void {
  const [table] = SlateEditor.node(editor, tablePath);

  // Only a table has columns to align
  if (!isTableElement(table)) {
    return;
  }

  // Replace the column's alignment
  const align: TableColumnAlignment[] = [...table.align];

  align[columnIndex] = alignment;

  Transforms.setNodes<TableElement>(editor, { align }, { at: tablePath });
}
