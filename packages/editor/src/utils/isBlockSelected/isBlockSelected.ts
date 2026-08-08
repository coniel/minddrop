import { ReactEditor } from 'slate-react';
import { Element } from '@minddrop/ast';
import { Editor } from '../../types';
import { getBlockSelectionRange } from '../getBlockSelectionRange';

/**
 * Checks whether an element is a top level block covered by the
 * editor's block selection.
 *
 * @param editor An editor instance.
 * @param element An element in the editor.
 * @returns Whether the element is a selected block.
 */
export function isBlockSelected(editor: Editor, element: Element): boolean {
  const range = getBlockSelectionRange(editor);

  // Nothing is selected as a block
  if (!range) {
    return false;
  }

  let path: number[];

  try {
    path = ReactEditor.findPath(editor, element);
  } catch {
    // The element may no longer be in the document
    return false;
  }

  // Only top level blocks can be selected as blocks
  if (path.length !== 1) {
    return false;
  }

  return path[0] >= range.firstIndex && path[0] <= range.lastIndex;
}
