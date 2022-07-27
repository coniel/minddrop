import { selectionContains } from '../selectionContains';
import { useSelection } from '../useSelection';

/**
 * Returns a boolean indicating whether the current selection
 * contains resources of the given type(s).
 *
 * @param resourceType - The resource type(s) of the selection items to check for.
 * @param exclusive - When `true`, the hook will only return true if the selection contains nothing but items of the given type(s).
 * @reutrns A boolean indicating whether resources of the given type are selected.
 */
export function useSelectionContains(
  resourceType: string | string[],
  exclusive?: boolean,
): boolean {
  // Get the current selection
  const selection = useSelection();

  // Return whether the selection contains the specified
  // resource type(s).
  return selectionContains(selection, resourceType, exclusive);
}
