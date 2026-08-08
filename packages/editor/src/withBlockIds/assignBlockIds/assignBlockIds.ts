import { Element } from '@minddrop/ast';
import { generateBlockId, hasBlockId } from '../../utils';

/**
 * Assigns a block ID to each of the given elements which does not
 * already have one, used to seed an editor's initial value.
 *
 * @param elements The elements to assign block IDs to.
 * @returns The elements, each with a block ID.
 */
export function assignBlockIds(elements: Element[]): Element[] {
  return elements.map((element) => {
    // Elements which already have an ID keep it
    if (hasBlockId(element)) {
      return element;
    }

    return { ...element, id: generateBlockId() };
  });
}
