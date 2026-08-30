import { Element } from '@minddrop/ast';
import { Editor } from '../types';

/**
 * Returns the inline elements within a block, limited to a single element
 * type when one is given.
 *
 * @param editor - An editor instance.
 * @param index - The index of the block.
 * @param type - The element type to limit the result to.
 * @returns The block's inline elements.
 */
export function getInlines<TElement extends Element = Element>(
  editor: Editor,
  index = 0,
  type?: string,
): TElement[] {
  // Grab the block whose inline elements are wanted
  const block = editor.children[index] as Element;

  // Keep the children which are elements, of the given type when one is set
  return block.children.filter(
    (child): child is TElement =>
      'type' in child && (!type || child.type === type),
  );
}
