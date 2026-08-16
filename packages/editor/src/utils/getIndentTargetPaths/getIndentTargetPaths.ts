import { Path } from 'slate';
import { Editor } from '../../types';
import { getElementAbove } from '../getElementAbove';
import { getSelectedBlocks } from '../getSelectedBlocks';

/**
 * Returns the paths of the blocks an indent acts on, being the selected
 * blocks, or the block the cursor is in when none are selected.
 *
 * @param editor - An editor instance.
 * @returns The block paths.
 */
export function getIndentTargetPaths(editor: Editor): Path[] {
  const selectedPaths = getSelectedBlocks(editor).map(([, path]) => path);

  if (selectedPaths.length) {
    return selectedPaths;
  }

  const entry = getElementAbove(editor);

  return entry ? [entry[1]] : [];
}
