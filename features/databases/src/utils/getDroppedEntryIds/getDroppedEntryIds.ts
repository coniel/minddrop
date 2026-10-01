import { DatabaseEntry } from '@minddrop/databases';
import { DropEventData } from '@minddrop/selection';
import { DatabaseEntriesDataKey } from '@minddrop/ui-databases';

/**
 * Returns the IDs of the database entries contained in a drop event's
 * data, in the order they were dragged.
 *
 * @param data - The drop event data.
 * @returns The dropped entry IDs, empty if the drop contained no entries.
 */
export function getDroppedEntryIds(data: DropEventData): DatabaseEntry['id'][] {
  // Get the dragged entries from the drop data
  const entries = (data.data as Record<string, unknown>)[
    DatabaseEntriesDataKey
  ];

  // Ignore drops which do not contain database entries
  if (!Array.isArray(entries)) {
    return [];
  }

  // Get the ID of each well-formed serialized entry
  return entries
    .map((entry: Partial<DatabaseEntry>) => entry?.id)
    .filter((id) => typeof id === 'string');
}
