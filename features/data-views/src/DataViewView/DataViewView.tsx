import { Collections } from '@minddrop/collections';
import { DataViews } from '@minddrop/data-views';
import { DatabaseEntries } from '@minddrop/databases';
import { PanelView } from '@minddrop/ui-components';
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

  // Entries from whichever data source the view uses
  const entries = collection ? collection.entries : databaseEntryIds;

  return (
    <div className="data-view-view">
      <PanelView
        stringTitle={dataView?.name || ''}
        contentIcon={dataView?.icon}
        className="data-view-view-panel"
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
