import { Events } from '@minddrop/events';
import { SelectionClearedEvent } from '../events';
import { getSelection } from '../getSelection';
import { removeFromSelection } from '../removeFromSelection';

/**
 * Clears the current selection.
 */
export function clearSelection(): void {
  // Get the current selection
  const selection = getSelection();

  // Remove the currently selected items
  removeFromSelection(selection);

  // Dispatch a selection cleared event
  Events.dispatch(SelectionClearedEvent, selection);
}
