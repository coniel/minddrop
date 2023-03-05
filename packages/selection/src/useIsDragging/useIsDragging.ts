import { getSelection } from '../getSelection';
import { selectionContains } from '../selectionContains';
import { useSelectionStore } from '../useSelectionStore';

/**
 * Returns a boolean indicating whether a drag action is in progress.
 * Optionally, one or more item types can be passed in to check
 * if the items being dragged are of the given type(s).
 *
 * @param itemType - The item type(s) of the selection items to check for.
 * @param exclusive - When `true`, the hook will only return true if the selection contains nothing but items of the given type(s).
 * @returns A boolean indicating the dragging state.
 */
export function useIsDragging(itemType?: string, exclusive?: boolean): boolean {
  // Get the dragging state
  const { isDragging } = useSelectionStore();

  if (!itemType) {
    // If no items were specified, simply return the
    // dragging state.
    return isDragging;
  }

  // Get the current selection
  const selection = getSelection();

  // Check if the selection (which is being dragged)
  // contains the specified item type(s).
  return isDragging && selectionContains(selection, itemType, exclusive);
}
