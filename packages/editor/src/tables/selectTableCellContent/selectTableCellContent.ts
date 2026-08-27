import { Range, Editor as SlateEditor } from 'slate';
import { Transforms } from '../../Transforms';
import { Editor } from '../../types';
import { getTableCellEntry } from '../getTableCellEntry';

/**
 * Selects the entire content of the cell the selection is in. When the
 * cell is already fully selected the keystroke is declined, letting a
 * repeated select-all expand to the whole document.
 *
 * @param editor - An editor instance.
 * @returns Whether the cell's content was selected.
 */
export function selectTableCellContent(editor: Editor): boolean {
  const cellEntry = getTableCellEntry(editor);

  // Outside a table there is no cell to select within
  if (!cellEntry) {
    return false;
  }

  const cellRange = SlateEditor.range(editor, cellEntry.cell[1]);

  // A second select-all on a fully selected cell expands to the document
  if (editor.selection && Range.equals(editor.selection, cellRange)) {
    return false;
  }

  Transforms.select(editor, cellRange);

  return true;
}
