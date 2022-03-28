import { mapById } from '@minddrop/utils';
import { RichTextElementNotFoundError } from '../errors';
import { filterRichTextElements } from '../filterRichTextElements';
import {
  RichTextElement,
  RichTextElementFilters,
  RichTextElementMap,
} from '../types';
import { useRichTextStore } from '../useRichTextStore';

/**
 * Retrieves rich text elements by ID. Returns a
 * `{ [id]: RichTextElement }` map of the requested elements.
 *
 * Throws a `RichTextElementNotFoundError` if any of the elements
 * do not exist.
 *
 * Optionally, the returned elements can be filtered by passing in
 * `RichTextElementFilters`.
 *
 * @param elementIds The IDs of the rich text elements to retrieve.
 * @returns A `{ [id]: RichTextElement }` map of the requested rich text elements.
 */
export function getRichTextElements<
  T extends RichTextElement = RichTextElement,
>(
  elementIds: string[],
  filters?: RichTextElementFilters,
): RichTextElementMap<T> {
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

  if (filters) {
    // If filters were provided, return filtered elements
    return filterRichTextElements(mapById(requestedElements), filters);
  }

  // Return a map of the requested elements
  return mapById(requestedElements);
}
