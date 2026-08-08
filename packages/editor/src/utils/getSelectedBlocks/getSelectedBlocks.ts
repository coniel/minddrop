import { NodeEntry, Path } from 'slate';
import { Element } from '@minddrop/ast';
import { Editor } from '../../types';
import { getBlockPathById } from '../getBlockPathById';
import { getBlockSelectionItems } from '../getBlockSelectionItems';

/**
 * Gets the editor's selected blocks, in document order.
 *
 * @param editor An editor instance.
 * @returns The selected blocks, or an empty array if none are selected.
 */
export function getSelectedBlocks(editor: Editor): NodeEntry<Element>[] {
  const paths = getBlockSelectionItems(editor)
    .map((item) => getBlockPathById(editor, item.data.blockId))
    // Selected blocks may since have been removed from the document
    .filter((path) => path !== null)
    .sort(Path.compare);

  return paths.map((path) => [editor.children[path[0]] as Element, path]);
}
