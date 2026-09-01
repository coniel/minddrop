import { Element } from '@minddrop/ast';
import { IdentifiedElement } from '../types';

/**
 * Checks whether an element carries a block ID.
 *
 * @param element - An element.
 * @returns Whether the element has a block ID.
 */
export function hasBlockId(element: Element): element is IdentifiedElement {
  return 'id' in element && typeof element.id === 'string';
}
