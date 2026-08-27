import { Editor as SlateEditor } from 'slate';
import { Transforms } from '../../Transforms';
import { Editor } from '../../types';
import { getTableCellEntry } from '../getTableCellEntry';
import { insertTableRow } from '../insertTableRow';
import { resolveNextTableCellPath } from '../table-elements';

/**
 * Moves the selection to the cell after the one it is in, wrapping to the
 * next row and selecting the target cell's content. In the table's last
 * cell the table grows by a row and the cursor lands in its first cell.
 *
 * @param editor - An editor instance.
 * @returns Whether the selection was inside a table cell.
 */
export function selectNextTableCell(editor: Editor): boolean {
  const cellEntry = getTableCellEntry(editor);

  // Outside a table there is nothing to move between
  if (!cellEntry) {
    return false;
  }

  const next = resolveNextTableCellPath(cellEntry);

  // In the last cell there is no cell to move to, so the table grows by a
  // row, whose first cell takes the cursor
  if (!next) {
    const [tableNode, tablePath] = cellEntry.table;

    insertTableRow(editor, tablePath, tableNode.children.length);

    return true;
  }

  // Select the whole cell so that typing replaces its content
  Transforms.select(editor, SlateEditor.range(editor, next));

  return true;
}
