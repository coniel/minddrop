import { filterSelectionItems } from '../filterSelectionItems';
import { SelectionItem } from '../types';
import { useSelectionStore } from '../useSelectionStore';

/**
 * Returns the current selection as an array of `SelectionItems`.
 * Optionally, one or more item types can be passed in to
 * retrieve only selection items matching the item types.
 *
 * @param itemType - The item type(s) of the selection items to retrieve.
 * @returns An array of selection items.
 */
export function useSelection(itemType?: string | string[]): SelectionItem[] {
  // Get the current selection
  const { selectedItems } = useSelectionStore();

  if (itemType) {
    // If item filter was passed in, filter the selection
    return filterSelectionItems(selectedItems, itemType);
  }

  return selectedItems;
}
