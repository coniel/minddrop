import { SelectionItem } from '../types';
import { SelectionStore } from '../useSelectionStore';

/**
 * Returns the current selection as an array of `SelectionItems`.
 *
 * @returns An array of selection items.
 */
export function useSelection(): SelectionItem[] {
  // Get the current selection
  const { selectedItems } = SelectionStore();

  return selectedItems;
}
