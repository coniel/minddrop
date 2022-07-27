import { useSelectionStore } from '../../useSelectionStore';

/**
 * Converts the current selection into a map of stringified
 * selection item arrays in which items are grouped by resource.
 *
 * @returns A `{ 'minddrop-selection/[resource]': string }` map.
 */
export function selectionToEventData(): Record<string, string> {
  // Get the current selection
  const selection = useSelectionStore.getState().selectedItems;

  // Group the selection items by resource
  const grouped = selection.reduce(
    (groups, item) => ({
      ...groups,
      [item.resource]: groups[item.resource]
        ? [...groups[item.resource], item]
        : [item],
    }),
    {},
  );

  // Stringify the grouped items and add 'mindrop-selection/'
  // prefix to the keys.
  return Object.keys(grouped).reduce(
    (stringified, resource) => ({
      ...stringified,
      [`minddrop-selection/${resource}`]: JSON.stringify(grouped[resource]),
    }),
    {},
  );
}
