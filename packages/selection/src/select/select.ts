import { Core } from '@minddrop/core';
import { addToSelection } from '../addToSelection';
import { clearSelection } from '../clearSelection';
import { SelectionItem } from '../types';

/**
 * Exclusively selects the provided items, clearing the current selection.
 * Dispatches as a selection:add event as well as a selection:remove event
 * if there were any selected items when the method was called.
 *
 * @param core - A MindDrop core instance.
 * @param items - The selection items of the items to select.
 */
export function select(core: Core, items: SelectionItem[]): void {
  // Clear the current selection
  clearSelection(core);

  // Add the items to the selection
  addToSelection(core, items);
}
