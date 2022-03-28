import { mapById } from '@minddrop/utils';
import { RichTextElementNotFoundError } from '../errors';
import { RichTextElement, RichTextElementMap } from '../types';
import { useRichTextStore } from '../useRichTextStore';

/**
 * Retrieves rich text elements by ID. Returns a
 * `{ [id]: RichTextElement }` map of the requested elements.
 *
 * Throws a `RichTextElementNotFoundError` if any of the elements
 * do not exist.
 *
 * @param elementIds The IDs of the rich text elements to retrieve.
 * @returns A `{ [id]: RichTextElement }` map of the requested rich text elements.
 */
export function getRichTextElements<
  T extends RichTextElement = RichTextElement,
>(elementIds: string[]): RichTextElementMap<T> {
  // Get all element sfrom the rich text store
  const elements = useRichTextStore.getState().elements as Record<string, T>;

  // Get the requested elements
  const requestedElements = elementIds.map((id) => elements[id]);

  if (requestedElements.includes(undefined)) {
    // If one or more of the requested items do not exist, make
    // a list of the missing element IDs
    const missingItemIds = elementIds.filter((id) => !elements[id]);

    // Throw a `RichTextElementNotFoundError` error providing the
    // missing element IDs.
    throw new RichTextElementNotFoundError(missingItemIds);
  }

  // Return a map of the requested elements
  return mapById(requestedElements);
}
