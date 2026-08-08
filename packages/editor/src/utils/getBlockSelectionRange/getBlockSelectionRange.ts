import { Editor } from '../../types';
import { BlockRange } from '../getBlockAlignedRange';
import { getSelectedBlocks } from '../getSelectedBlocks';

/**
 * Gets the range of top level blocks covered by the editor's block
 * selection.
 *
 * @param editor An editor instance.
 * @returns The selected block range, or null if no blocks are selected.
 */
export function getBlockSelectionRange(editor: Editor): BlockRange | null {
  const blocks = getSelectedBlocks(editor);

  // No blocks are selected
  if (!blocks.length) {
    return null;
  }

  return {
    firstIndex: blocks[0][1][0],
    lastIndex: blocks[blocks.length - 1][1][0],
  };
}
