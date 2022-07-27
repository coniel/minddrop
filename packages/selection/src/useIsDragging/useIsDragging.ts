import { getSelection } from '../getSelection';
import { selectionContains } from '../selectionContains';
import { useSelectionStore } from '../useSelectionStore';

/**
 * Returns a boolean indicating whether a drag action is in progress.
 * Optionally, one or more resource types can be passed in to check
 * if the items being dragged are of the given type(s).
 *
 * @param resourceType - The resource type(s) of the selection items to check for.
 * @param exclusive - When `true`, the hook will only return true if the selection contains nothing but items of the given type(s).
 * @returns A boolean indicating the dragging state.
 */
export function useIsDragging(
  resourceType?: string,
  exclusive?: boolean,
): boolean {
  // Get the dragging state
  const { isDragging } = useSelectionStore();

  if (!resourceType) {
    // If no resources were specified, simply return the
    // dragging state.
    return isDragging;
  }

  // Get the current selection
  const selection = getSelection();

  // Check if the selection (which is being dragged)
  // contains the specified resource type(s).
  return isDragging && selectionContains(selection, resourceType, exclusive);
}
