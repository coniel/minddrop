import { Events } from '@minddrop/events';
import { SelectionStore } from '../SelectionStore';
import { SelectionClearedEvent } from '../events';
import { getSelection } from '../getSelection';
import { removeFromSelection } from '../removeFromSelection';

/**
 * Clears the current selection and resets the dragging state.
 */
export function clearSelection(): void {
  // Get the current selection
  const selection = getSelection();

  // Remove the currently selected items
  removeFromSelection(selection);

  // Reset the dragging state
  SelectionStore.getState().setIsDragging(false);

  // Dispatch a selection cleared event
  Events.dispatch(SelectionClearedEvent, selection);
}
