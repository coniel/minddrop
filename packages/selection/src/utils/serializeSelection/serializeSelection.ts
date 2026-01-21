import { getSelection } from '../../getSelection';
import { SelectionItem } from '../../types';
import { toMimeType } from '../toMimeType';

/**
 * Serializes the current selection into a format compatible with the clipboard
 * and data transfer objects.
 *
 * @returns Serialized selection data.
 */
export function serializeSelection(): Record<string, string> {
  const selection = getSelection();

  // If the selection is empty do nothing
  if (!selection.length) {
    return {};
  }

  // Group the selection items by type
  const selectionItemsByType = selection.reduce<
    Record<string, (SelectionItem['data'] | SelectionItem)[]>
  >((acc, item) => {
    // If the item has no data, use the item itself as the data
    const data = item.data ?? item;

    if (!acc[item.type]) {
      acc[item.type] = [data];
    } else {
      acc[item.type].push(data);
    }

    return acc;
  }, {});

  // Serialize the selection items by type
  return Object.entries(selectionItemsByType).reduce<Record<string, string>>(
    (acc, [type, items]) => {
      acc[toMimeType(type)] = JSON.stringify(items);

      return acc;
    },
    {},
  );
}
