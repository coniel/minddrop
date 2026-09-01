import { getElementTypeConfig } from '@minddrop/ast';

/**
 * Checks whether an element type's content is a black box the editor does
 * not edit as text.
 *
 * @param type - The element type.
 * @returns Whether the type is a void element.
 */
export function isVoidElement(type: string): boolean {
  return getElementTypeConfig(type)?.content === 'void';
}
