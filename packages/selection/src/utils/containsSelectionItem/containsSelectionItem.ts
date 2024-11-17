import { SelectionItem } from '../../types';

/**
 * Checks if a selection item is present in an
 * array of selection items.
 *
 * @param items - The array of selection items in which to search.
 * @param searchItem - The item to search for.
 * @returns A boolean indicating whether the item is in the array.
 */
export function containsSelectionItem(
  items: SelectionItem[],
  searchItem: SelectionItem,
): boolean {
  // Check if the items contains the search item by checking
  // for a matching id.
  return !!items.find((item) => item.id === searchItem.id);
}
