import { Selection } from '@minddrop/selection';
import { Editor } from '../types';
import { getBlockSelectionItems } from '../utils';

/**
 * Deselects the editor's blocks, leaving any selection made
 * elsewhere in the app alone.
 *
 * @param editor An editor instance.
 */
export function clearBlockSelection(editor: Editor): void {
  const items = getBlockSelectionItems(editor);

  // Nothing of the editor's is selected
  if (!items.length) {
    return;
  }

  Selection.remove(items);
}
