import { Range, Editor as SlateEditor } from 'slate';
import { Editor } from '../../types';
import { exitTableBelow } from '../exitTableBelow';
import { getTableCellEntry } from '../getTableCellEntry';

/**
 * Moves the caret from the very end of a table's last cell to the block
 * after the table, adding a paragraph when the table ends the document.
 *
 * @param editor - An editor instance.
 * @returns Whether the caret was moved out of the table.
 */
export function exitTableForward(editor: Editor): boolean {
  const { selection } = editor;

  // Only a collapsed caret moves out
  if (!selection || !Range.isCollapsed(selection)) {
    return false;
  }

  const cellEntry = getTableCellEntry(editor);

  if (!cellEntry) {
    return false;
  }

  const [, tablePath] = cellEntry.table;

  // The table's own end is the end of its last cell
  if (!SlateEditor.isEnd(editor, selection.anchor, tablePath)) {
    return false;
  }

  exitTableBelow(editor, tablePath);

  return true;
}
