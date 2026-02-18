import { serializeSelection } from '../serializeSelection';

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
  // Serialize the selection items
  const data = serializeSelection();

  // Set the serialized data to the data transfer object
  Object.entries(data).forEach(([key, value]) => {
    dataTransfer.setData(key, value);
  });
}
