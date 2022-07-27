import { getSelection } from '../getSelection';

/**
 * Returns the IDs of items in the current selection
 * as a array. Optionally, one or more resource types
 * can be passed in to retrieve only IDs of selection
 * items matching the resource types.
 *
 * @param resourceType - The resource type(s) of the selection items for which to retrieve the IDs.
 * @returns An array of IDs.
 */
export function getSelectionIds(resourceType?: string | string[]): string[] {
  // Return the IDs of the items in the
  // current selection.
  return getSelection(resourceType).map((item) => item.id);
}
