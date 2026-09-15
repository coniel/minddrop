import { useMemo } from 'react';
import { ContentView } from '@minddrop/content-views';
import { Databases } from '@minddrop/databases';
import { PropertiesSchema } from '@minddrop/properties';
import { useContentViewEntries } from './useContentViewEntries';

/**
 * Lists the properties a content view's entries can be filtered by.
 *
 * @param view - The content view to resolve the filter properties of.
 * @returns The properties the view's entries can be filtered by.
 */
export function useContentViewFilterProperties(
  view: ContentView,
): PropertiesSchema {
  // The databases the view's entries belong to
  const entryIds = useContentViewEntries(view);
  const entryDatabases = Databases.useFromEntries(entryIds);
  // The source database, which lists its properties even while it
  // has no entries.
  const sourceDatabase = Databases.use(
    view.dataSource.type === 'database' ? view.dataSource.id : '',
  );

  // Collection and query sources take their properties from the
  // databases their entries belong to.
  const databases = useMemo(
    () => (sourceDatabase ? [sourceDatabase] : entryDatabases),
    [sourceDatabase, entryDatabases],
  );

  // Resolve the databases' filterable properties
  return Databases.useFilterableProperties(databases);
}
