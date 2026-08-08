import { Editor } from '../../types';
import { getBlockSelectionRange } from '../getBlockSelectionRange';

/**
 * Checks whether the editor's selection is a block selection
 * rather than a selection of text.
 *
 * @param editor An editor instance.
 * @returns Whether blocks are selected.
 */
export function isBlockSelection(editor: Editor): boolean {
  return getBlockSelectionRange(editor) !== null;
}
