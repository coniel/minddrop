import { Events } from '@minddrop/events';
import { SelectionItemSerializersStore } from '../SelectionItemSerializersStore';
import { clearSelection } from '../clearSelection';
import { SelectionDeletedEvent, SelectionDeletedEventData } from '../events';
import { getSelection } from '../getSelection';
import { SelectionItem } from '../types';
import { groupSelectionItemsByType } from '../utils';

/**
 * Delets the current selection.
 *
 * @dispatches selection:deleted
 */
export function deleteSelection(): void {
  const selection = getSelection();

  // If the selection is empty then there's nothing to do
  if (!selection.length) {
    return;
  }

  const deletedItems: SelectionItem[] = [];
  const grouped = groupSelectionItemsByType(selection);

  // Check each item type and delete the items if the serializer has
  // a delete function.
  grouped.forEach(([type, items]) => {
    const serializer = SelectionItemSerializersStore.get(type);

    if (serializer?.delete) {
      serializer.delete(items);
      deletedItems.push(...items);
    }
  });

  // If no items were deleted, prevent selection from being cleared
  // as the items were not deletable.
  if (!deletedItems.length) {
    return;
  }

  // Clear the selection
  clearSelection();

  // Dispatch a selection deleted event
  Events.dispatch<SelectionDeletedEventData>(
    SelectionDeletedEvent,
    deletedItems,
  );
}
