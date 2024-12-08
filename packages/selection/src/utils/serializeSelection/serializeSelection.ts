import { getSelectionItemTypeConfig } from '../../SelectionItemTypeConfigsStore';
import { getSelection } from '../../getSelection';

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

  // Use the first selection item to decide the type of the selection.
  // If the selection contains multiple types, the rest will be ignored.
  const selectionType = selection[0].type;

  // Filter out any items that don't match the selection type
  const filteredSelection = selection.filter(
    (item) => item.type === selectionType,
  );

  // Get the config for the selection items type
  const config = getSelectionItemTypeConfig(selectionType);

  // Serialize the selection items
  return config.serializeData(filteredSelection);
}
