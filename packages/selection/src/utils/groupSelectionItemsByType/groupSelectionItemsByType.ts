import { SelectionItem } from '../../types';

/**
 * Groups the selection items by type into an array of [type, items] tuples.
 *
 * @param selection - The selection items to group.
 * @returns An array of [type, items] tuples.
 */
export function groupSelectionItemsByType(
  selection: SelectionItem[],
): [string, SelectionItem[]][] {
  const groupedSelection: Record<string, SelectionItem[]> = {};

  selection.forEach((item) => {
    if (!groupedSelection[item.type]) {
      groupedSelection[item.type] = [];
    }

    groupedSelection[item.type].push(item);
  });

  return Object.entries(groupedSelection);
}
