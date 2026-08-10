import { Collection, Collections } from '@minddrop/collections';
import { DataViews, ViewDataSourceType } from '@minddrop/data-views';
import { DatabaseEntries } from '@minddrop/databases';
import { Queries } from '@minddrop/queries';
import { PanelView } from '@minddrop/ui-components';
import { DataViewOptionsMenu } from '../DataViewOptionsMenu';
import { DataViewRenderer } from '../DataViewRenderer';
import './DataViewView.css';

export interface DataViewViewProps {
  /**
   * The ID of the data view to display.
   */
  dataViewId: string;
}

/**
 * Renders a data view as a standalone page in a panel. Renders a
 * missing view notice when the data view no longer exists.
 */
export const DataViewView: React.FC<DataViewViewProps> = ({ dataViewId }) => {
  const dataView = DataViews.use(dataViewId);

  // The collection when the data source is a collection
  const collectionId =
    dataView?.dataSource.type === 'collection' ? dataView.dataSource.id : '';
  const collection = Collections.use(collectionId);

  // Entry IDs when the data source is a database
  const databaseId =
    dataView?.dataSource.type === 'database' ? dataView.dataSource.id : '';
  const databaseEntryIds = DatabaseEntries.useIds(databaseId);

  // Query result entry IDs when the data source is a query
  const queryId =
    dataView?.dataSource.type === 'query' ? dataView.dataSource.id : '';
  const queryEntryIds = Queries.useResults(queryId);

  // Entries from whichever data source the view uses
  const entries = resolveEntries(
    dataView?.dataSource.type,
    collection,
    databaseEntryIds,
    queryEntryIds,
  );

  return (
    <div className="data-view-view">
      <PanelView
        stringTitle={dataView?.name || ''}
        contentIcon={dataView?.icon}
        className="data-view-view-panel"
        actions={
          dataView
            ? [<DataViewOptionsMenu key="options" view={dataView} />]
            : []
        }
      >
        <DataViewRenderer
          view={dataView ?? undefined}
          viewDeleted={!dataView}
          entries={entries}
        />
      </PanelView>
    </div>
  );
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
