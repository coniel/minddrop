import { TextElement } from '../types/TextElement.types';

/**
 * Builds a text element carrying the given text and marks.
 *
 * @param text - The element's text content.
 * @param marks - Marks applied to the text.
 * @returns The text element.
 */
export function generateTextElement(
  text = '',
  marks: Omit<TextElement, 'text'> = {},
): TextElement {
  return {
    ...marks,
    text,
  };
}
