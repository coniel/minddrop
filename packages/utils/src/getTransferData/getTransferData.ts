import { TransferData, parseTransferData } from '../parseTransferData';

/**
 * Returns the data from a drag event or clipboard event, removing the
 * MindDrop data key prefix and JSON suffix if present.
 *
 * @param event - The drag event or clipboard event.
 * @returns The data from the event.
 */
export function getTransferData<TCustom = object>(
  event: React.DragEvent | DragEvent | React.ClipboardEvent | ClipboardEvent,
): TransferData<TCustom> {
  // Read the event's data transfer
  const dataTransfer =
    'dataTransfer' in event ? event.dataTransfer : event.clipboardData;

  if (!dataTransfer) {
    return {} as TransferData<TCustom>;
  }

  // The raw data entries, keyed by type
  const entries: Record<string, string> = {};

  // Read the data of every type
  for (const type of dataTransfer.types) {
    // Skip the files type. Files are read off the transfer's file
    // list.
    if (type === 'Files') {
      continue;
    }

    // Read the type's data
    entries[type] = dataTransfer.getData(type);
  }

  // Read the transferred files
  const files =
    dataTransfer.files && dataTransfer.files.length > 0
      ? Array.from(dataTransfer.files)
      : [];

  // Parse the entries into transfer data
  return parseTransferData<TCustom>(entries, files);
}
