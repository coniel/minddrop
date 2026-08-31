import { isEntityId } from '@minddrop/utils';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { DatabaseEntry } from '../../types';
import { EntrySortOptions, sortDatabaseEntries } from '../sortDatabaseEntries';

/**
 * Orders a list of entry IDs by the value of the sorted property.
 * IDs which do not belong to an entry in the store, such as a
 * collection's non-entry items, carry no sortable value and are
 * appended in their original order.
 *
 * @param entryIds - The IDs to sort.
 * @param sort - The sort options.
 * @returns The sorted entry IDs.
 */
export function sortDatabaseEntryIds(
  entryIds: string[],
  sort: EntrySortOptions = {},
): string[] {
  const entries: DatabaseEntry[] = [];
  const unsortable: string[] = [];

  for (const id of entryIds) {
    // IDs of other item types are not entries
    if (!isEntityId(id, 'database-entry')) {
      unsortable.push(id);

      continue;
    }

    const entry = DatabaseEntriesStore.get(id);

    // Entries missing from the store cannot be sorted
    if (!entry) {
      unsortable.push(id);

      continue;
    }

    entries.push(entry);
  }

  return [
    ...sortDatabaseEntries(entries, sort).map((entry) => entry.id),
    ...unsortable,
  ];
}
