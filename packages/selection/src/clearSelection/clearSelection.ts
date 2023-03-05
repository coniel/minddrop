import { Core } from '@minddrop/core';
import { getSelection } from '../getSelection';
import { removeFromSelection } from '../removeFromSelection';
import { useSelectionStore } from '../useSelectionStore';

/**
 * Clears the current selection and resets the dragging state.
 * Dispatches a `selection:items:remove` event.
 *
 * @param core - A MindDrop core instance.
 */
export function clearSelection(core: Core): void {
  // Get the current selection
  const selection = getSelection();

  // Remove the currently selected items
  removeFromSelection(core, selection);

  // Reset the dragging state
  useSelectionStore.getState().setIsDragging(false);
}
