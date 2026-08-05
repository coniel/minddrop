import { DataViews } from '@minddrop/data-views';
import { Events } from '@minddrop/events';
import { PanelView } from '@minddrop/ui-components';
import { MenuGroup, MenuItem, ScrollArea } from '@minddrop/ui-primitives';
import { OpenDataViewViewEvent, OpenDataViewViewEventData } from '../events';
import './DataViewsView.css';

/**
 * Renders a panel view listing all persisted data views.
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

  return (
    <PanelView
      className="data-views-view"
      icon="layers"
      title="dataViews.labels.views"
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
