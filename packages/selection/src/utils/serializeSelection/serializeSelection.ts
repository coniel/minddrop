import { SelectionItemSerializersStore } from '../../SelectionItemSerializersStore';
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
    Record<string, SelectionItem[]>
  >((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [item];
    } else {
      acc[item.type].push(item);
    }

    return acc;
  }, {});

  const data: Record<string, string> = {
    'text/plain': '',
    'text/html': '',
  };

  // Serialize the selection items by type
  Object.entries(selectionItemsByType).forEach(([type, items]) => {
    // Get the serializer for the type
    const serializer = SelectionItemSerializersStore.get(type);

    // Serialize items to their MindDrop JSON representation
    data[toMimeType(type)] =
      serializer?.toJsonString?.(items) ??
      JSON.stringify(items.map((item) => item.data));

    // Serialize items to plain text
    if (serializer?.toPlainText) {
      // Add a newline if there is already text in the plain text data
      if (data['text/plain']) {
        data['text/plain'] += '\n';
      }

      // Serialize items to plain text
      data['text/plain'] += serializer.toPlainText(items);
    }

    // Serialize items to HTML
    if (serializer?.toHtml) {
      // Add a newline if there is already text in the HTML data
      if (data['text/html']) {
        data['text/html'] += '\n';
      }

      // Serialize items to HTML
      data['text/html'] += serializer.toHtml(items);
    }
  });

  return data;
}
