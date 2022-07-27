import { Core } from '@minddrop/core';
import { containsSelectionItem, dedupeSelectionItemsArray } from '../utils';
import { SelectionItem } from '../types';
import { useSelectionStore } from '../useSelectionStore';

/**
 * Adds the provided items to the current selection.
 * Dispatches a `selection:items:add` event.
 *
 * @param core - A MindDrop core instance.
 * @param items - The selection items to add to the selection.
 */
export function addToSelection(core: Core, items: SelectionItem[]): void {
  // Get the current selection
  const selection = useSelectionStore.getState().selectedItems;

  // Remove potential duplicates from the list of items to add
  const deduped = dedupeSelectionItemsArray(items);

  // Get the list of items to add by filtering out items
  // already in the selection.
  const itemsToAdd = deduped.filter(
    (item) => !containsSelectionItem(selection, item),
  );

  // Add the items to the current selection
  useSelectionStore.getState().addSelectedItems(itemsToAdd);

  // Dispatch a 'selection:items:add' event
  core.dispatch('selection:items:add', itemsToAdd);
}
