import { useMemo } from 'react';
import { ContentView, ContentViewTypes } from '@minddrop/content-views';
import { DatabaseEntries } from '@minddrop/databases';

/**
 * Orders a content view's entries according to its sort options.
 * Entries of view types which are not sortable are returned
 * unchanged.
 *
 * @param view - The content view rendering the entries.
 * @param entries - The IDs of the entries to sort.
 * @returns The sorted entry IDs.
 */
export function useSortedContentViewEntries(
  view: ContentView,
  entries: string[],
): string[] {
  const viewType = ContentViewTypes.use(view.type);
  // Subscribes to the entries being sorted so that the sort
  // re-runs when their values change.
  const databaseEntries = DatabaseEntries.useByIds(entries);

  // View types positioning entries themselves have no sortable
  // order.
  const sortable = !!viewType?.sortable;

  return useMemo(() => {
    // Unsortable views render their entries as provided
    if (!sortable) {
      return entries;
    }

    return DatabaseEntries.sortIds(entries, {
      by: view.options?.sortBy,
      property: view.options?.sortProperty,
      direction: view.options?.sortDirection,
    });
    // The subscribed entries are a dependency because the sort
    // reads their values from the store
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sortable,
    entries,
    databaseEntries,
    view.options?.sortBy,
    view.options?.sortProperty,
    view.options?.sortDirection,
  ]);
}
