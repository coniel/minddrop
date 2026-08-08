import { Editor } from '../../types';
import { BlockRange, getBlockAlignedRange } from '../getBlockAlignedRange';

/**
 * Gets the range of top level blocks covered by a block selection.
 *
 * A block selection is a selection which covers whole blocks. It
 * either covers several of them, or covers a single block which
 * was selected deliberately rather than by selecting its text.
 *
 * @param editor An editor instance.
 * @returns The selected block range, or null if there is no block selection.
 */
export function getBlockSelectionRange(editor: Editor): BlockRange | null {
  const range = getBlockAlignedRange(editor);

  // Only whole blocks can be selected as blocks
  if (!range) {
    return null;
  }

  // Covering a single block whole is also what selecting all of its
  // text does, so it only counts when block mode was entered.
  if (range.firstIndex === range.lastIndex && !editor.blockSelectionMode) {
    return null;
  }

  return range;
}
