import { SelectionStore } from './SelectionStore';
import { SelectionItem } from './types';

/**
 * Replaces the selected item with the same ID as the given item.
 * Does nothing when no such item is selected.
 *
 * @param item - The selection item to update.
 */
export function updateSelectionItem(item: SelectionItem): void {
  SelectionStore.getState().updateSelectedItem(item);
}
