import { Events } from '@minddrop/events';
import { SelectionClearedEvent, SelectionClearedEventData } from '../events';
import { getSelection } from '../getSelection';
import { removeFromSelection } from '../removeFromSelection';
import { SelectionStore } from '../useSelectionStore';

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
  Events.dispatch<SelectionClearedEventData>(SelectionClearedEvent, selection);
}
