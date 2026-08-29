import { Events } from '@minddrop/events';
import { Tabs } from '@minddrop/feature-views';
import { MenuItem } from '@minddrop/ui-primitives';
import { DataViewsViewName, OpenDataViewsViewEvent } from './events';

/**
 * Renders the sidebar menu item which opens the data views view.
 */
export const DataViewsMenuItem: React.FC = () => {
  const active = Tabs.useIsViewActive(DataViewsViewName);

  // Open the data views view
  function handleClick() {
    Events.dispatch(OpenDataViewsViewEvent);
  }

  return (
    <MenuItem
      muted
      active={active}
      icon="layers"
      label="dataViews.labels.views"
      onClick={handleClick}
    />
  );
};
