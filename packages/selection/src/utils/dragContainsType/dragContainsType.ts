import { toMimeType } from '../toMimeType';

/**
 * Checks whether a drag event's data transfer contains data of any
 * of the given types. Works during drag over events, when the data
 * values themselves are not yet readable.
 *
 * Types are MindDrop data keys (e.g. 'database-entries') unless they
 * contain a '/' or are 'Files', in which case they are matched as raw
 * MIME types.
 *
 * @param event - The drag event to check.
 * @param types - The data types to check for.
 * @returns Whether the drag contains data of any of the given types.
 */
export function dragContainsType(
  event: React.DragEvent | DragEvent,
  types: string[],
): boolean {
  // Drags without a data transfer object carry no data
  if (!event.dataTransfer) {
    return false;
  }

  const transferTypes = event.dataTransfer.types;

  // Match if any of the given types is present in the transfer
  return types.some((type) => {
    // Raw MIME types and the special 'Files' key match as is
    if (type.includes('/') || type === 'Files') {
      return transferTypes.includes(type);
    }

    // MindDrop data keys match their serialized MIME type,
    // in both JSON and plain form
    return (
      transferTypes.includes(toMimeType(type)) ||
      transferTypes.includes(toMimeType(type, false))
    );
  });
}
