import { Core } from '@minddrop/core';
import { SelectionItem } from '../types';
import { useSelectionStore } from '../useSelectionStore';
import { dedupeSelectionItemsArray } from '../utils';

/**
 * Removes the provided items from the current selection.
 * Dispatches a `selection:items:remove` event.
 *
 * @param core - A MindDrop core instance.
 * @param items - The selection items to remove from the current selection.
 */
export function removeFromSelection(core: Core, items: SelectionItem[]): void {
  // Remove potential duplicates from the items array
  const itemsToRemove = dedupeSelectionItemsArray(items);

  // Remove the items from the current selection
  useSelectionStore.getState().removeSelectedItems(itemsToRemove);

  // Dispatch a 'selection:items:remove' event
  core.dispatch('selection:items:remove', itemsToRemove);
}
