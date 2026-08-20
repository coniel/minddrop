import { Collection, Collections } from '@minddrop/collections';
import { DataView, ViewDataSourceType } from '@minddrop/data-views';
import { DatabaseEntries } from '@minddrop/databases';
import { Queries } from '@minddrop/queries';
import { DataViewRenderer } from './DataViewRenderer';

export interface DataViewContentProps {
  /**
   * The data view to render.
   */
  dataView: DataView;
}

/**
 * Renders a data view's contents, populated with the entries
 * provided by its data source.
 */
export const DataViewContent: React.FC<DataViewContentProps> = ({
  dataView,
}) => {
  // The collection when the data source is a collection
  const collectionId =
    dataView.dataSource.type === 'collection' ? dataView.dataSource.id : '';
  const collection = Collections.use(collectionId);

  // Entry IDs when the data source is a database
  const databaseId =
    dataView.dataSource.type === 'database' ? dataView.dataSource.id : '';
  const databaseEntryIds = DatabaseEntries.useIds(databaseId);

  // Query result entry IDs when the data source is a query
  const queryId =
    dataView.dataSource.type === 'query' ? dataView.dataSource.id : '';
  const queryEntryIds = Queries.useResults(queryId);

  // Entries from whichever data source the view uses
  const entries = resolveEntries(
    dataView.dataSource.type,
    collection,
    databaseEntryIds,
    queryEntryIds,
  );

  return <DataViewRenderer view={dataView} entries={entries} />;
};

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
