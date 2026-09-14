import { Filters } from '@minddrop/filters';
import { getAllDatabaseEntries } from '../getAllDatabaseEntries';
import { getDatabaseEntry } from '../getDatabaseEntry';
import { DatabaseEntry } from '../types';
import { resolveEntryIcon, resolveEntryPropertyValue } from '../utils';

/**
 * Registers the filter adapter for database entries.
 */
export function registerDatabaseEntryFilterAdapter(): void {
  // Register entries, read through their property values and
  // labelled by title.
  Filters.registerAdapter<DatabaseEntry>({
    type: 'database-entry',
    get: (id) => getDatabaseEntry(id, false),
    getAll: getAllDatabaseEntries,
    resolveValue: (entry, filter) =>
      resolveEntryPropertyValue(entry, filter.property, filter.propertyType),
    label: (entry) => entry.title,
    icon: resolveEntryIcon,
  });
}
