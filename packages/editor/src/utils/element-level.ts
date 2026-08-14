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

/**
 * Checks whether an element type sits inside a block's inline content.
 *
 * @param type - The element type.
 * @returns Whether the type is an inline element.
 */
export function isInlineElement(type: string): boolean {
  return getElementTypeConfig(type)?.level === 'inline';
}

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
