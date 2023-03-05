import { SelectionItem } from '../../types';
import { useSelectionStore } from '../../useSelectionStore';

/**
 * Converts the current selection into a map of stringified
 * selection item arrays in which items are grouped by type.
 *
 * @returns A `{ 'minddrop-selection/[type]': string }` map.
 */
export function selectionToEventData(): Record<string, string> {
  // Get the current selection
  const selection = useSelectionStore.getState().selectedItems;

  // Group the selection items by type
  const grouped = selection.reduce(
    (groups, item) => ({
      ...groups,
      [item.type]: groups[item.type] ? [...groups[item.type], item] : [item],
    }),
    {} as Record<string, SelectionItem[]>,
  );

  // Stringify the grouped items and add 'mindrop-selection/'
  // prefix to the keys.
  return Object.keys(grouped).reduce(
    (stringified, item) => ({
      ...stringified,
      [`minddrop-selection/${item}`]: JSON.stringify(grouped[item]),
    }),
    {},
  );
}
