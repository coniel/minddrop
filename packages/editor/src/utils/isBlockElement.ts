import { getElementTypeConfig } from '@minddrop/ast';

/**
 * Checks whether an element type participates in the block flow.
 *
 * @param type - The element type.
 * @returns Whether the type is a block element.
 */
export function isBlockElement(type: string): boolean {
  return getElementTypeConfig(type)?.level === 'block';
}
