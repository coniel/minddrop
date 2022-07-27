import { containsSelectionItem } from '../containsSelectionItem';
import { SelectionItem } from '../../types';

/**
 * Removes duplicates from an array of selection items.
 *
 * @param items - The array of selection items.
 * @returns The deduped selection items array.
 */
export function dedupeSelectionItemsArray(
  items: SelectionItem[],
): SelectionItem[] {
  return items.reduce(
    (deduped, item) =>
      // Add the item to the deduped list only if not
      // already present.
      containsSelectionItem(deduped, item) ? deduped : [...deduped, item],
    [],
  );
}
