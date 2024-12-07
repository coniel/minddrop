import { getSelection } from '../getSelection';
import { removeFromSelection } from '../removeFromSelection';
import { useSelectionStore } from '../useSelectionStore';

/**
 * Clears the current selection and resets the dragging state.
 */
export function clearSelection(): void {
  // Get the current selection
  const selection = getSelection();

  // Remove the currently selected items
  removeFromSelection(selection);

  // Reset the dragging state
  useSelectionStore.getState().setIsDragging(false);
}
