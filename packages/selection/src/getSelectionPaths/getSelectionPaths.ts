import { getSelection } from '../getSelection';

/**
 * Returns the paths of items in the current selection
 * as a array. Optionally, one or more item types
 * can be passed in to retrieve only paths of selection
 * items matching the given types.
 *
 * @param itemType - The item type(s) of the selection items for which to retrieve the paths.
 * @returns An array of paths.
 */
export function getSelectionPaths(itemType?: string | string[]): string[] {
  // Return the paths of the items in the current selection.
  return getSelection(itemType).map((item) => item.path);
}
