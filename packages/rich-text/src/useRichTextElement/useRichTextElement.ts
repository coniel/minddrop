import { RichTextElement } from '../types';
import { useRichTextStore } from '../useRichTextStore';

/**
 * Returns a rich text element by ID or `null` if
 * the element does not exist.
 */
export function useRichTextElement<
  TElement extends RichTextElement = RichTextElement,
>(elementId: string): TElement | null {
  // Get elements from the store
  const { elements } = useRichTextStore();

  // Return the requested element
  return (elements[elementId] as TElement) || null;
}
