import { Events } from '@minddrop/events';
import { SelectionItem } from '../types';
import { useSelectionStore } from '../useSelectionStore';
import { dedupeSelectionItemsArray } from '../utils';

/**
 * Removes the provided items from the current selection.
 *
 * @param core - A MindDrop core instance.
 * @param items - The selection items to remove from the current selection.
 * @dispatches 'selection:items:remove'
 */
export function removeFromSelection(items: SelectionItem[]): void {
  // Remove potential duplicates from the items array
  const itemsToRemove = dedupeSelectionItemsArray(items);

  // Remove the items from the current selection
  useSelectionStore.getState().removeSelectedItems(itemsToRemove);

  // Dispatch a 'selection:items:remove' event
  Events.dispatch('selection:items:remove', itemsToRemove);
}
