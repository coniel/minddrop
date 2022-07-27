import { getSelection } from '../getSelection';
import { SelectionItem } from '../types';
import { containsSelectionItem } from '../utils';

/**
 * Returns a boolean indicating whether or not
 * the given item is currently selected.
 *
 * @param item - The item for which to check the selected state.
 * @returns A boolean indicating the selected state.
 */
export function isSelected(item: SelectionItem): boolean {
  // Get the current selection
  const selection = getSelection();

  // Check if the item is in the selection
  return containsSelectionItem(selection, item);
}
