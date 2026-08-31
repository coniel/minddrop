import { useMemo } from 'react';
import { DataView } from '@minddrop/data-views';
import { Databases, SortableEntryProperty } from '@minddrop/databases';
import { useDataViewEntries } from '../useDataViewEntries';

/**
 * Lists the properties a data view's entries can be sorted by.
 *
 * @param view - The data view to resolve the sort properties of.
 * @returns The properties the view's entries can be sorted by.
 */
export function useDataViewSortProperties(
  view: DataView,
): SortableEntryProperty[] {
  const entryIds = useDataViewEntries(view);
  const entryDatabases = Databases.useFromEntries(entryIds);
  // The source database, which lists its properties even while it
  // has no entries
  const sourceDatabase = Databases.use(
    view.dataSource.type === 'database' ? view.dataSource.id : '',
  );

  // Collection and query sources take their properties from the
  // databases their entries belong to
  const databases = useMemo(
    () => (sourceDatabase ? [sourceDatabase] : entryDatabases),
    [sourceDatabase, entryDatabases],
  );

  return Databases.useSortableProperties(databases);
}
