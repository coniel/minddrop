import { Editor as SlateEditor } from 'slate';
import { Element } from '@minddrop/ast';
import { Transforms } from '../Transforms';
import { selectBlocks } from '../selectBlocks';
import { Editor } from '../types';
import { getContentStartIndex } from '../utils';

/**
 * Inserts the given blocks at an insertion point, selecting them
 * where they land.
 *
 * @param editor An editor instance.
 * @param elements The block elements to insert.
 * @param index The index to insert the blocks at.
 */
export function insertBlocksAt(
  editor: Editor,
  elements: Element[],
  index: number,
): void {
  // Nothing to insert
  if (!elements.length) {
    return;
  }

  // Blocks never land above the title
  const insertIndex = Math.max(index, getContentStartIndex(editor));

  SlateEditor.withoutNormalizing(editor, () => {
    // Insert the blocks as siblings at the insertion point
    Transforms.insertNodes(editor, elements, { at: [insertIndex] });

    // Select the inserted blocks
    selectBlocks(editor, [insertIndex], [insertIndex + elements.length - 1]);
  });
}
