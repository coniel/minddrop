import { getSelectionItemTypeConfig } from '../../SelectionItemTypeConfigsStore';
import { clearSelection } from '../../clearSelection';
import { getSelection } from '../../getSelection';

/**
 * Calls the selection items type config's delete function
 * on the current selection.
 */
export function deleteSelectionItems(): void {
  const selection = getSelection();

  // If the selection is empty do nothing
  if (!selection.length) {
    return;
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

  // Delete the selection items
  config.onDelete(filteredSelection);

  // Clear the selection
  clearSelection();
}
