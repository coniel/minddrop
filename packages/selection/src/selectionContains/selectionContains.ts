import { SelectionItem } from '../types';
import { filterSelectionItems } from '../filterSelectionItems';

/**
 * Returns a boolean indicating whether the given selection items
 * contain items of the given type(s).
 *
 * @param selectionItems - The array of selection items in which to check.
 * @param itemType - The item type(s) of the selection items to check for.
 * @param exclusive - When `true`, the hook will only return true if the selection contains nothing but items of the given type(s).
 * @reutrns A boolean indicating whether items of the given type are selected.
 */
export function selectionContains(
  selectionItems: SelectionItem[],
  itemType: string | string[],
  exclusive?: boolean,
): boolean {
  if (selectionItems.length === 0) {
    // If the selection is empty, return `false`
    return false;
  }

  // Filter the current selection for the requested
  // item type(s).
  const requested = filterSelectionItems(selectionItems, itemType);

  if (exclusive) {
    // If `exclusive` is true, the selection must equal
    // the requested items.
    return selectionItems.length === requested.length;
  }

  return requested.length > 0;
}
