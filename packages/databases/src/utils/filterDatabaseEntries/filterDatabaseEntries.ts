import { PropertyFilter, PropertyFilters } from '@minddrop/properties';
import { DatabaseEntry } from '../../types';
import { resolveEntryPropertyValue } from '../resolveEntryPropertyValue';

/**
 * Returns the entries matching every filter.
 *
 * @param entries - The entries to filter.
 * @param filters - The filters to match.
 * @param now - The reference date for relative date values, defaults to the current time.
 *
 * @returns The matching entries.
 */
export function filterDatabaseEntries(
  entries: DatabaseEntry[],
  filters: PropertyFilter[],
  now?: Date,
): DatabaseEntry[] {
  return PropertyFilters.apply(
    entries,
    filters,
    (entry, filter) =>
      resolveEntryPropertyValue(entry, filter.property, filter.propertyType),
    now,
  );
}
