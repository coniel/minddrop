import { RichTextElementNotFoundError } from '../errors';
import { RichTextElement } from '../types';
import { useRichTextStore } from '../useRichTextStore';

/**
 * Returns a rich text element by ID.
 *
 * @param elementId The ID of the rich text element to retrieve.
 * @returns The requested rich text element.
 */
export function getRichTextElement<T extends RichTextElement = RichTextElement>(
  elementId: string,
): T {
  // Get the element from the rich text store
  const element = useRichTextStore.getState().elements[elementId] as T;

  if (!element) {
    // Throw a `RichTextElementNotFoundError` if the element does not exist,
    // providing the ID of the missing element.
    throw new RichTextElementNotFoundError(elementId);
  }

  // Return the element
  return element;
}
