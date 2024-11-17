import { SelectionItem } from '../types';
import { useSelectionStore } from '../useSelectionStore';

/**
 * Returns the current selection as an array of `SelectionItems`.
 *
 * @returns An array of selection items.
 */
export function useSelection(): SelectionItem[] {
  // Get the current selection
  const { selectedItems } = useSelectionStore();

  return selectedItems;
}
