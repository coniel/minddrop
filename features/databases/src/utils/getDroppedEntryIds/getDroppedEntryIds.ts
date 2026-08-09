import { DatabaseEntry } from '@minddrop/databases';
import { DropEventData } from '@minddrop/selection';
import { DatabaseEntriesDataKey } from '@minddrop/ui-components';

/**
 * Returns the IDs of the database entries contained in a drop event's
 * data, in the order they were dragged.
 *
 * @param data - The drop event data.
 * @returns The dropped entry IDs, empty if the drop contained no entries.
 */
export function getDroppedEntryIds(data: DropEventData): DatabaseEntry['id'][] {
  // Drops from outside the app carry no MindDrop data
  if (!data.data || typeof data.data !== 'object') {
    return [];
  }

  const entries = (data.data as Record<string, unknown>)[
    DatabaseEntriesDataKey
  ];

  // Ignore drops which do not contain database entries
  if (!Array.isArray(entries)) {
    return [];
  }

  // Pull the ID off each serialized entry, dropping malformed ones
  return entries
    .map((entry: Partial<DatabaseEntry>) => entry?.id)
    .filter((id) => typeof id === 'string');
}
