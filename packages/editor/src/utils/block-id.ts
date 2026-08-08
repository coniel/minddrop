import { Element } from '@minddrop/ast';
import { uuid } from '@minddrop/utils';
import { IdentifiedElement } from '../types';

/**
 * Generates a block ID.
 *
 * @returns A block ID.
 */
export function generateBlockId(): string {
  return uuid();
}

/**
 * Checks whether an element carries a block ID.
 *
 * @param element An element.
 * @returns Whether the element has a block ID.
 */
export function hasBlockId(element: Element): element is IdentifiedElement {
  return 'id' in element && typeof element.id === 'string';
}
