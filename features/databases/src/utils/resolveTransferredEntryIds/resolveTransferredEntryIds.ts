import { DatabaseEntry } from '@minddrop/databases';
import { DatabaseEntriesDataKey } from '@minddrop/ui-databases';
import { TransferData } from '@minddrop/utils';

/**
 * Returns the IDs of the database entries contained in transfer data,
 * in the order they were transferred.
 *
 * @param data - The transfer data.
 * @returns The transferred entry IDs, empty if the data contains no entries.
 */
export function resolveTransferredEntryIds(
  data: TransferData<{ [DatabaseEntriesDataKey]?: unknown }>,
): DatabaseEntry['id'][] {
  // Get the transferred entries
  const entries = data[DatabaseEntriesDataKey];

  // Ignore data which does not contain database entries
  if (!Array.isArray(entries)) {
    return [];
  }

  // Get the ID of each well-formed serialized entry
  return entries
    .map((entry: Partial<DatabaseEntry>) => entry?.id)
    .filter((id) => typeof id === 'string');
}
