import { SelectionItem } from '../types';

/**
 * Filters the given selection items by one or more
 * item types.
 *
 * @param items - The selection items to filter.
 * @param itemType - The item type(s) to filter by.
 * @returns An array of selection items.
 */
export function filterSelectionItems(
  items: SelectionItem[],
  itemType: string | string[],
): SelectionItem[] {
  // Get the item type(s) as an array
  const types = typeof itemType === 'string' ? [itemType] : itemType;

  // Filter the selected items by the given type(s)
  return items.filter((item) => types.includes(item.type));
}
