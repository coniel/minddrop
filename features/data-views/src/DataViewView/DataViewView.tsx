import { DataViews } from '@minddrop/data-views';
import { PanelView } from '@minddrop/ui-components';
import {
  DataViewFilterMenu,
  DataViewSettingsMenu,
  DataViewSortMenu,
} from '@minddrop/ui-data-views';
import { DataViewContent } from '../DataViewContent';
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

  // Notice shown when the data view no longer exists
  if (!dataView) {
    return (
      <div className="data-view-view">
        <PanelView className="data-view-view-panel">
          <DataViewRenderer viewDeleted />
        </PanelView>
      </div>
    );
  }

  return (
    <div className="data-view-view">
      <PanelView
        stringTitle={dataView.name}
        contentIcon={dataView.icon}
        className="data-view-view-panel"
        actions={[
          <DataViewFilterMenu key="filter" view={dataView} />,
          <DataViewSortMenu key="sort" view={dataView} />,
          <DataViewSettingsMenu key="options" view={dataView} />,
        ]}
      >
        <DataViewContent dataView={dataView} />
      </PanelView>
    </div>
  );
};
