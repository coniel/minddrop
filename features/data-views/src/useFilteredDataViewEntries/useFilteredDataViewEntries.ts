import { useMemo } from 'react';
import { DataView, DataViewTypes } from '@minddrop/data-views';
import { DatabaseEntries } from '@minddrop/databases';
import { Filters } from '@minddrop/filters';

// Stable empty list used when the view has no filters
const NO_FILTERS: never[] = [];

/**
 * Narrows a data view's entries to those matching its filters.
 * Entries of view types which are not filterable are returned
 * unchanged.
 *
 * @param view - The data view rendering the entries.
 * @param entries - The IDs of the entries to filter.
 * @returns The matching entry IDs.
 */
export function useFilteredDataViewEntries(
  view: DataView,
  entries: string[],
): string[] {
  // Resolve the view's type
  const viewType = DataViewTypes.use(view.type);
  // Subscribe to the entries being filtered so that the filter
  // re-runs when their values change.
  const databaseEntries = DatabaseEntries.useByIds(entries);

  // Read whether the view type filters, and the view's filters
  const filterable = !!viewType?.filterable;
  const filters = view.options?.filters ?? NO_FILTERS;

  return useMemo(() => {
    // Unfilterable views render their entries as provided
    if (!filterable) {
      return entries;
    }

    // Return the entries matching the filters
    return Filters.filterIds(entries, filters);
    // The subscribed entries are a dependency because the filter
    // reads their values from the store.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterable, entries, databaseEntries, filters]);
}
