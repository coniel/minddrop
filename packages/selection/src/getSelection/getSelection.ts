import { SelectionItem } from '../types';
import { SelectionStore } from '../useSelectionStore';

/**
 * Returns the current selection as a SelectionItem array.
 *
 * @returns An array of selection items.
 */
export function getSelection(): SelectionItem[] {
  // Get the current selection
  const selection = SelectionStore.getState().selectedItems;

  return selection;
}
