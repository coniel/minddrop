import { Element, Frame } from '@minddrop/ast';
import { Editor } from '../types';

/**
 * Returns the containers a block sits inside as they stand in the editor.
 *
 * @param editor - An editor instance.
 * @param index - The index of the block.
 * @returns The block's ancestry.
 */
export function getAncestry(
  editor: Editor,
  index: number,
): Frame[] | undefined {
  return (editor.children[index] as Element).ancestry;
}
