import { mapById } from '@minddrop/utils';
import { getRichTextElementConfig } from '../getRichTextElementConfig';
import {
  RichTextElement,
  RichTextElementFilters,
  RichTextElementMap,
} from '../types';

/**
 * Filters rich text elements according to the provided filters.
 *
 * Provided elements must be of registered types, or a
 * `RichTextElementTypeNotRegisteredError` will be thrown.
 *
 * @param elements The rich text elements to filter.
 * @param filters The filtering options.
 * @returns The filtered rich text elements.
 */
export function filterRichTextElements<
  T extends RichTextElement = RichTextElement,
>(
  elements: RichTextElementMap<T>,
  filters: RichTextElementFilters,
): RichTextElementMap<T> {
  const filtered = Object.values(elements).filter((element) => {
    // Get the element's configuration object, will throw if
    // the element type is not registered.
    const config = getRichTextElementConfig(element.type);

    // Filter by level
    if (filters.level && config.level !== filters.level) {
      return false;
    }

    // Filter elements by type
    if (filters.type && !filters.type.includes(element.type)) {
      return false;
    }

    // Filter elements by voidness
    if (typeof filters.void !== 'undefined' && !!config.void !== filters.void) {
      return false;
    }

    // Filter elements by deleted state
    if (
      typeof filters.deleted !== 'undefined' &&
      !!element.deleted !== filters.deleted
    ) {
      return false;
    }

    return true;
  });

  // Return the filtered elements as a RichTextElementMap
  return mapById(filtered);
}
