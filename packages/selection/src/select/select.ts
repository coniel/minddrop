import { addToSelection } from '../addToSelection';
import { clearSelection } from '../clearSelection';
import { SelectionItem } from '../types';

/**
 * Exclusively selects the provided items, clearing the current selection.
 * Dispatches as a selection:add event as well as a selection:remove event
 * if there were any selected items when the method was called.
 *
 * @param items - The selection items of the items to select.
 */
export function select(items: SelectionItem[]): void {
  // Clear the current selection
  clearSelection();

  // Add the items to the selection
  addToSelection(items);
}
