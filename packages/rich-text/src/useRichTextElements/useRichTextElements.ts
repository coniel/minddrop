import { filterRichTextElements } from '../filterRichTextElements';
import {
  RichTextElement,
  RichTextElementFilters,
  RichTextElementMap,
} from '../types';
import { useRichTextStore } from '../useRichTextStore';

/**
 * Returns a `{ [id]: RichTextElement }` map of rich text elements
 * by ID. If a requested element does not exist, it is ommited from
 * the map.
 *
 * Optionally, the returned elements can be filtered by passing in
 * `RichTextElementFilters`.
 *
 * @param elementIds The IDs of the elements to retrieve.
 * @param filters Optional filters by which to filter the returned elements.
 * @returns A `{ [id]: RichTextElement }` map of the requested elements.
 */
export function useRichTextElements<
  TElement extends RichTextElement = RichTextElement,
>(
  elementIds: string[],
  filters?: RichTextElementFilters,
): RichTextElementMap<TElement> {
  // Get the elements from the store
  const { elements } = useRichTextStore();

  // Create a map of the requrested elements
  const requestedElements = elementIds.reduce((map, elementId) => {
    if (!elements[elementId]) {
      // Omit the element from the map if it does not exist
      return map;
    }

    // Add the element to the map
    return {
      ...map,
      [elementId]: elements[elementId],
    };
  }, {});

  if (filters) {
    // Filter the elements if filtering options were supplied
    return filterRichTextElements(requestedElements, filters);
  }

  // Return all requrested elements
  return requestedElements;
}
