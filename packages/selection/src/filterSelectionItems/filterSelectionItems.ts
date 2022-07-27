import { SelectionItem } from '../types';

/**
 * Filters the given selection items by one or more
 * resource types.
 *
 * @param items - The selection items to filter.
 * @param resourceType - The resource type(s) to filter by.
 * @returns An array of selection items.
 */
export function filterSelectionItems(
  items: SelectionItem[],
  resourceType: string | string[],
): SelectionItem[] {
  // Get the resource type(s) as an array
  const types =
    typeof resourceType === 'string' ? [resourceType] : resourceType;

  // Filter the selected items by the given resource type(s)
  return items.filter((item) => types.includes(item.resource));
}
