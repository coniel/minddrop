import { filterSelectionItems } from '../filterSelectionItems';
import { useSelection } from '../useSelection';

/**
 * Returns a boolean indicating whether the selection
 * contains resources of the given type(s).
 *
 * @param resourceType - The resource type(s) of the selection items to check for.
 * @param exclusive - When true, the hook will only return true if the selection contains nothing but items of the given type(s).
 * @reutrns A boolean indicating whether resources of the given type are selected.
 */
export function useSelectionContains(
  resourceType: string | string[],
  exclusive?: boolean,
): boolean {
  // Get the current selection
  const selection = useSelection();

  if (selection.length === 0) {
    // If the selection is empty, return `false`
    return false;
  }

  // Filter the current selection for the requested
  // resource type(s).
  const requested = filterSelectionItems(selection, resourceType);

  if (exclusive) {
    // If `exclusive` is true, the selection must equal
    // the requested items.
    return selection.length === requested.length;
  }

  // Do something useful
  return requested.length > 0;
}
