import { Collection, Collections } from '@minddrop/collections';
import { DataView, ViewDataSourceType } from '@minddrop/data-views';
import { DatabaseEntries } from '@minddrop/databases';
import { Queries } from '@minddrop/queries';

/**
 * Subscribes to the entries provided by a data view's data source.
 *
 * @param view - The data view to resolve the entries of.
 * @returns The entry IDs, empty when there is no view.
 */
export function useDataViewEntries(view?: DataView | null): string[] {
  // The collection when the data source is a collection
  const collectionId =
    view?.dataSource.type === 'collection' ? view.dataSource.id : '';
  const collection = Collections.use(collectionId);

  // Entry IDs when the data source is a database
  const databaseId =
    view?.dataSource.type === 'database' ? view.dataSource.id : '';
  const databaseEntryIds = DatabaseEntries.useIds(databaseId);

  // Query result entry IDs when the data source is a query
  const queryId = view?.dataSource.type === 'query' ? view.dataSource.id : '';
  const queryEntryIds = Queries.useResults(queryId);

  // Views without a data source have no entries of their own
  if (!view) {
    return [];
  }

  return resolveEntries(
    view.dataSource.type,
    collection,
    databaseEntryIds,
    queryEntryIds,
  );
}

/**
 * Returns the entry IDs provided by the view's data source
 * type.
 */
function resolveEntries(
  sourceType: ViewDataSourceType | undefined,
  collection: Collection | null,
  databaseEntryIds: string[],
  queryEntryIds: string[],
): string[] {
  // Collection sources list their items directly
  if (sourceType === 'collection') {
    return collection?.items || [];
  }

  // Query sources list the query's result entries
  if (sourceType === 'query') {
    return queryEntryIds;
  }

  return databaseEntryIds;
}
