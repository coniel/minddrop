import { Events } from '@minddrop/events';
import { MenuItem } from '@minddrop/ui-primitives';
import { OpenDataViewsViewEvent } from './events';

/**
 * Renders the sidebar menu item which opens the data views view.
 */
export const DataViewsMenuItem: React.FC = () => {
  // Open the data views view
  function handleClick() {
    Events.dispatch(OpenDataViewsViewEvent);
  }

  return (
    <MenuItem
      muted
      icon="layers"
      label="dataViews.labels.views"
      onClick={handleClick}
    />
  );
};
