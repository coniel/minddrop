import { Filters } from '@minddrop/filters';
import { EntryEntityType } from '../constants';
import { getAllEntries } from '../getAllEntries';
import { getEntry } from '../getEntry';
import { Entry } from '../types';
import { resolveEntryIcon, resolveEntryPropertyValue } from '../utils';

/**
 * Registers the filter adapter for database entries.
 */
export function registerEntryFilterAdapter(): void {
  // Register entries, read through their property values and
  // labelled by title.
  Filters.registerAdapter<Entry>({
    type: EntryEntityType,
    get: (id) => getEntry(id, false),
    getAll: getAllEntries,
    resolveValue: (entry, filter) =>
      resolveEntryPropertyValue(entry, filter.property, filter.propertyType),
    label: (entry) => entry.title,
    icon: resolveEntryIcon,
  });
}
