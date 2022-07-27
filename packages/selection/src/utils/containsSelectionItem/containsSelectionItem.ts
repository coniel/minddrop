import { stringifySelectionItem } from '../stringifySelectionItem';
import { SelectionItem } from '../../types';

/**
 * Checks if a selection item is present in an
 * array of selection items.
 *
 * @param haystack - The array of selection items in which to search.
 * @param needle - The item to search for.
 * @returns A boolean indicating whether the item is in the array.
 */
export function containsSelectionItem(
  haystack: SelectionItem[],
  needle: SelectionItem,
): boolean {
  // Create a stringified version of the haystack
  const stringifiedHaystack = haystack.map((item) =>
    stringifySelectionItem(item),
  );

  // Check if the stringified haystack contains the
  // stringified needle.
  return stringifiedHaystack.includes(stringifySelectionItem(needle));
}
