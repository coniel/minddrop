import { getSelection } from '../../getSelection';
import { getSelectionItemTypeConfig } from '../../SelectionItemTypeConfigsStore';

/**
 * Serializes the current selection to a data transfer object.
 *
 * @param dataTransfer - The data transfer object to serialize the selection to.
 *
 * @throws {SelectionSerializerNotRegisteredError} - If the selection serializer for the selection type is not registered.
 */
export function serializeSelectionToDataTransfer(
  dataTransfer: DataTransfer,
): void {
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

  // Set the data on the data transfer object
  config.setDataOnDataTransfer(dataTransfer, filteredSelection);
}
