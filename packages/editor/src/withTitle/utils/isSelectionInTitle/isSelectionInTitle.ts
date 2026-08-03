import { Range } from 'slate';
import { Editor } from '../../../types';

/**
 * Checks whether the current selection starts inside the title
 * element. Assumes the title feature is enabled, in which case
 * the title is always the editor's first node.
 *
 * @param editor - The editor instance.
 * @returns Whether the selection starts inside the title.
 */
export function isSelectionInTitle(editor: Editor): boolean {
  // No selection means the title is not being edited
  if (!editor.selection) {
    return false;
  }

  return Range.start(editor.selection).path[0] === 0;
}
