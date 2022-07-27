import { filterSelectionItems } from '../filterSelectionItems';
import { SelectionItem } from '../types';
import { useSelectionStore } from '../useSelectionStore';

/**
 * Returns the current selection as an array of `SelectionItems`.
 * Optionally, one or more resource types can be passed in to
 * retrieve only selection items matching the resource types.
 *
 * @param resourceType - The resource type(s) of the selection items to retrieve.
 * @returns An array of selection items.
 */
export function useSelection(
  resourceType?: string | string[],
): SelectionItem[] {
  // Get the current selection
  const { selectedItems } = useSelectionStore();

  if (resourceType) {
    // If resource filter was passed in, filter the selection
    return filterSelectionItems(selectedItems, resourceType);
  }

  return selectedItems;
}
