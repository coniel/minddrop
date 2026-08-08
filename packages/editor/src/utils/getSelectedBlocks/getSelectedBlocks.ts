import { NodeEntry } from 'slate';
import { Element } from '@minddrop/ast';
import { Editor } from '../../types';
import { getBlockSelectionRange } from '../getBlockSelectionRange';

/**
 * Gets the top level blocks covered by the editor's block
 * selection.
 *
 * @param editor An editor instance.
 * @returns The selected blocks, or an empty array if there is no block selection.
 */
export function getSelectedBlocks(editor: Editor): NodeEntry<Element>[] {
  const range = getBlockSelectionRange(editor);

  // Nothing to collect without a block selection
  if (!range) {
    return [];
  }

  const entries: NodeEntry<Element>[] = [];

  // Blocks are selected as a contiguous run, so the range's ends
  // describe every block between them.
  for (let index = range.firstIndex; index <= range.lastIndex; index += 1) {
    entries.push([editor.children[index] as Element, [index]]);
  }

  return entries;
}
