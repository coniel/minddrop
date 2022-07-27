import { filterSelectionItems } from '../filterSelectionItems';
import { SelectionItem } from '../types';
import { useSelectionStore } from '../useSelectionStore';

/**
 * Returns the current selection as a SelectionItem array.
 * Optionally, one or more resource types can be passed in to
 * retrieve only selection items matching the resource types.
 *
 * @param resourceType - The resource type(s) of the selection items to retrieve.
 * @returns An array of selection items.
 */
export function getSelection(
  resourceType?: string | string[],
): SelectionItem[] {
  // Get the current selection
  const selection = useSelectionStore.getState().selectedItems;

  if (resourceType) {
    // If resource filter was passed in, filter the selection
    return filterSelectionItems(selection, resourceType);
  }

  return selection;
}
