import { Events } from '@minddrop/events';
import { SelectionStore } from '../SelectionStore';
import { SelectionItemsAddedEvent } from '../events';
import { SelectionItem } from '../types';
import { containsSelectionItem, dedupeSelectionItemsArray } from '../utils';

/**
 * Adds the provided items to the current selection.
 *
 * @param items - The selection items to add to the selection.
 * @dispatches 'selection:items:added'
 */
export function addToSelection(items: SelectionItem[]): void {
  // Get the current selection
  const selection = SelectionStore.getState().selectedItems;

  // Remove potential duplicates from the list of items to add
  const deduped = dedupeSelectionItemsArray(items);

  // Get the list of items to add by filtering out items
  // already in the selection.
  const itemsToAdd = deduped.filter(
    (item) => !containsSelectionItem(selection, item),
  );

  // Add the items to the current selection
  SelectionStore.getState().addSelectedItems(itemsToAdd);

  // Dispatch selection items added event
  Events.dispatch(SelectionItemsAddedEvent, itemsToAdd);
}
