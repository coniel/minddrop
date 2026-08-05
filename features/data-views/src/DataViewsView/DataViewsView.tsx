import { DataViews } from '@minddrop/data-views';
import { Events } from '@minddrop/events';
import { AddDataViewMenu, PanelView } from '@minddrop/ui-components';
import { MenuGroup, MenuItem, ScrollArea } from '@minddrop/ui-primitives';
import {
  OpenDataViewViewEvent,
  OpenDataViewViewEventData,
  OpenNewDataViewViewEvent,
  OpenNewDataViewViewEventData,
} from '../events';
import './DataViewsView.css';

/**
 * Renders a panel view listing all persisted data views, with a
 * header button to create a new one.
 */
export const DataViewsView: React.FC = () => {
  const dataViews = DataViews.useAll();

  // List only persisted data views, excluding virtual ones
  const persistedDataViews = dataViews.filter((dataView) => !dataView.virtual);

  // Open the clicked data view's view
  function handleOpenDataViewView(dataViewId: string) {
    Events.dispatch<OpenDataViewViewEventData>(OpenDataViewViewEvent, {
      dataViewId,
    });
  }

  // Open the new data view view for the selected view type
  function handleSelectViewType(viewType: string) {
    Events.dispatch<OpenNewDataViewViewEventData>(OpenNewDataViewViewEvent, {
      viewType,
    });
  }

  return (
    <PanelView
      className="data-views-view"
      icon="layers"
      title="dataViews.labels.views"
      actions={[
        <AddDataViewMenu
          key="add-view"
          color="neutral"
          onSelectViewType={handleSelectViewType}
        />,
      ]}
    >
      {/* The list of data views */}
      <ScrollArea className="data-views-view-content">
        <MenuGroup>
          {persistedDataViews.map((dataView) => (
            <MenuItem
              muted
              contentIcon={dataView.icon}
              key={dataView.id}
              onClick={() => handleOpenDataViewView(dataView.id)}
            >
              {dataView.name}
            </MenuItem>
          ))}
        </MenuGroup>
      </ScrollArea>
    </PanelView>
  );
};
