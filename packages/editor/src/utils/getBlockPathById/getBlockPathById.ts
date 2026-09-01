import { Path, Element as SlateElement } from 'slate';
import { Editor } from '../../types';
import { hasBlockId } from '../hasBlockId';

/**
 * Gets the path of the top level block carrying the given block ID.
 *
 * @param editor An editor instance.
 * @param blockId A block ID.
 * @returns The block's path, or null if no block carries the ID.
 */
export function getBlockPathById(editor: Editor, blockId: string): Path | null {
  const index = editor.children.findIndex(
    (node) =>
      SlateElement.isElement(node) && hasBlockId(node) && node.id === blockId,
  );

  return index === -1 ? null : [index];
}
