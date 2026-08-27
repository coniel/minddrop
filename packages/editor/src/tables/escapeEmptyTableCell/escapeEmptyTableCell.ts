import { Path, Range, Editor as SlateEditor, Node as SlateNode } from 'slate';
import { Transforms } from '../../Transforms';
import { Editor } from '../../types';
import { exitTableBelow } from '../exitTableBelow';
import { getTableCellEntry } from '../getTableCellEntry';
import {
  resolveNextTableCellPath,
  resolvePreviousTableCellPath,
} from '../table-elements';

/**
 * Moves the caret out of an empty table cell to the neighbouring cell, or
 * out of the table at its edge.
 *
 * An empty cell's only caret position is a zero width placeholder, which
 * native horizontal movement treats as a character to cross, taking two
 * presses to leave the cell. Cells with content are left to native
 * movement.
 *
 * @param editor - An editor instance.
 * @param direction - Which way the caret is moving.
 * @returns Whether the caret was moved out of an empty cell.
 */
export function escapeEmptyTableCell(
  editor: Editor,
  direction: 'backward' | 'forward',
): boolean {
  const { selection } = editor;

  // Only a collapsed caret gets stuck on the placeholder
  if (!selection || !Range.isCollapsed(selection)) {
    return false;
  }

  const cellEntry = getTableCellEntry(editor);

  if (!cellEntry) {
    return false;
  }

  // A cell with content has real caret positions, which native movement
  // crosses fine
  if (SlateNode.string(cellEntry.cell[0]) !== '') {
    return false;
  }

  // Move into the neighbouring cell, wrapping between rows
  if (direction === 'forward') {
    const next = resolveNextTableCellPath(cellEntry);

    if (next) {
      Transforms.select(editor, SlateEditor.start(editor, next));

      return true;
    }

    // From the last cell, step out to the block after the table, adding a
    // paragraph when the table ends the document
    exitTableBelow(editor, cellEntry.table[1]);

    return true;
  }

  const previous = resolvePreviousTableCellPath(cellEntry);

  if (previous) {
    Transforms.select(editor, SlateEditor.end(editor, previous));

    return true;
  }

  return stepOutBackward(editor, cellEntry.table[1]);
}

/**
 * Moves the caret from the table's first cell to the block before the
 * table.
 *
 * @param editor - An editor instance.
 * @param tablePath - The table's path.
 * @returns Whether the keystroke was consumed.
 */
function stepOutBackward(editor: Editor, tablePath: Path): boolean {
  // The table starts the document, leaving nowhere to move to
  if (tablePath[tablePath.length - 1] === 0) {
    return true;
  }

  Transforms.select(editor, SlateEditor.end(editor, Path.previous(tablePath)));

  return true;
}
