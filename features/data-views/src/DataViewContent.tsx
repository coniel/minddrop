import { DataView } from '@minddrop/data-views';
import { DataViewRenderer } from './DataViewRenderer';
import { useDataViewEntries } from './useDataViewEntries';

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
  // Entries from whichever data source the view uses
  const entries = useDataViewEntries(dataView);

  return <DataViewRenderer view={dataView} entries={entries} />;
};
