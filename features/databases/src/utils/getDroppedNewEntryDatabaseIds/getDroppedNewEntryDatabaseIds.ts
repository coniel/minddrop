import { DatabaseId } from '@minddrop/databases';
import { DropEventData } from '@minddrop/selection';
import { NewDatabaseEntriesDataKey } from '@minddrop/ui-databases';
import { isEntityId } from '@minddrop/utils';

/**
 * Returns the IDs of the databases in which a drop event's new entry
 * cards create entries, in the order they were dragged.
 *
 * @param data - The drop event data.
 * @returns The dropped database IDs, empty if the drop contained no new entry cards.
 */
export function getDroppedNewEntryDatabaseIds(
  data: DropEventData,
): DatabaseId[] {
  // Get the new entry cards' database IDs from the drop data
  const databaseIds = (data.data as Record<string, unknown>)[
    NewDatabaseEntriesDataKey
  ];

  // Ignore drops which do not contain new entry cards
  if (!Array.isArray(databaseIds)) {
    return [];
  }

  // Drop malformed IDs
  return databaseIds.filter(
    (id) => typeof id === 'string' && isEntityId(id, 'database'),
  );
}
