import { Editor as SlateEditor } from 'slate';
import { Transforms } from '../../Transforms';
import { Editor } from '../../types';
import { getTableCellEntry } from '../getTableCellEntry';
import { resolvePreviousTableCellPath } from '../table-elements';

/**
 * Moves the selection to the cell before the one it is in, wrapping to the
 * previous row and selecting the target cell's content. In the table's
 * first cell the selection stays put.
 *
 * @param editor - An editor instance.
 * @returns Whether the selection was inside a table cell.
 */
export function selectPreviousTableCell(editor: Editor): boolean {
  const cellEntry = getTableCellEntry(editor);

  // Outside a table there is nothing to move between
  if (!cellEntry) {
    return false;
  }

  const previous = resolvePreviousTableCellPath(cellEntry);

  // The first cell has no cell before it, but the keystroke was still the
  // table's
  if (!previous) {
    return true;
  }

  // Select the whole cell so that typing replaces its content
  Transforms.select(editor, SlateEditor.range(editor, previous));

  return true;
}
