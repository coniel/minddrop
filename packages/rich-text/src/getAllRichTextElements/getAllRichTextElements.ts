import { filterRichTextElements } from '../filterRichTextElements';
import {
  RichTextElement,
  RichTextElementFilters,
  RichTextElementMap,
} from '../types';
import { useRichTextStore } from '../useRichTextStore';

/**
 * Returns all rich text elements as a `{ [id]: RichTextElement }` map.
 *
 * Optionally, the returned elements can by filtered by passing in
 * `RichTextElementFilters`.
 *
 * @param filters Optional filters by which to filter the returned elements.
 */
export function getAllRichTextElements<
  T extends RichTextElement = RichTextElement,
>(filters?: RichTextElementFilters): RichTextElementMap<T> {
  // Get all elements from the rich text store
  const elements = useRichTextStore.getState()
    .elements as RichTextElementMap<T>;

  if (filters) {
    // If filters are provided, return the filtered elements
    return filterRichTextElements<T>(elements, filters);
  }

  // Return all elements
  return elements;
}
