import { Events } from '@minddrop/events';
import {
  SelectionItemsAddedEvent,
  SelectionItemsAddedEventData,
} from '../events';
import { SelectionItem } from '../types';
import { SelectionStore } from '../useSelectionStore';
import { containsSelectionItem, dedupeSelectionItemsArray } from '../utils';

/**
 * Adds the provided items to the current selection.
 *
 * @param items - The selection items to add to the selection.
 * @dipatches 'selection:items:add'
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
  Events.dispatch<SelectionItemsAddedEventData>(
    SelectionItemsAddedEvent,
    itemsToAdd,
  );
}
