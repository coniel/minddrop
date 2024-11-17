import { SelectionItem } from '../types';
import { useSelectionStore } from '../useSelectionStore';

/**
 * Returns the current selection as a SelectionItem array.
 *
 * @returns An array of selection items.
 */
export function getSelection(): SelectionItem[] {
  // Get the current selection
  const selection = useSelectionStore.getState().selectedItems;

  return selection;
}
