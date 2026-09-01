import { getElementTypeConfig } from '@minddrop/ast';

/**
 * Checks whether an element type sits inside a block's inline content.
 *
 * @param type - The element type.
 * @returns Whether the type is an inline element.
 */
export function isInlineElement(type: string): boolean {
  return getElementTypeConfig(type)?.level === 'inline';
}
