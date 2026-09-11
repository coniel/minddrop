import { PropertyFilter } from '@minddrop/properties';
import { isEntityId } from '@minddrop/utils';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { filterDatabaseEntries } from '../filterDatabaseEntries';

/**
 * Returns the IDs whose entries match every filter. IDs not
 * belonging to a stored entry fail the filter.
 *
 * @param entryIds - The IDs to filter.
 * @param filters - The filters to match.
 * @param now - The reference date for relative date values, defaults to the current time.
 *
 * @returns The matching IDs, in their original order.
 */
export function filterDatabaseEntryIds(
  entryIds: string[],
  filters: PropertyFilter[],
  now: Date = new Date(),
): string[] {
  // Nothing to filter by
  if (filters.length === 0) {
    return entryIds;
  }

  return entryIds.filter((id) => {
    if (!isEntityId(id, 'database-entry')) {
      return false;
    }

    const entry = DatabaseEntriesStore.get(id);

    if (!entry) {
      return false;
    }

    return filterDatabaseEntries([entry], filters, now).length > 0;
  });
}
