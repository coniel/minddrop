import { DatabaseId } from '@minddrop/databases';
import { NewDatabaseEntriesDataKey } from '@minddrop/ui-databases';
import { TransferData, isEntityId } from '@minddrop/utils';

/**
 * Returns the IDs of the databases in which transfer data's new entry
 * cards create entries, in the order they were transferred.
 *
 * @param data - The transfer data.
 * @returns The database IDs, empty if the data contains no new entry cards.
 */
export function resolveTransferredNewEntryDatabaseIds(
  data: TransferData<{ [NewDatabaseEntriesDataKey]?: unknown }>,
): DatabaseId[] {
  // Get the new entry cards' database IDs
  const databaseIds = data[NewDatabaseEntriesDataKey];

  // Ignore data which does not contain new entry cards
  if (!Array.isArray(databaseIds)) {
    return [];
  }

  // Drop malformed IDs
  return databaseIds.filter(
    (id) => typeof id === 'string' && isEntityId(id, 'database'),
  );
}
