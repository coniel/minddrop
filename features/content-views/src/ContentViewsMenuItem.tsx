import { ContentViews } from '@minddrop/content-views';
import { Events } from '@minddrop/events';
import { Tabs } from '@minddrop/feature-views';
import { MenuItem } from '@minddrop/ui-primitives';
import { ContentViewsViewName, OpenContentViewsViewEvent } from './events';

/**
 * Renders the sidebar menu item which opens the content views view.
 */
export const ContentViewsMenuItem: React.FC = () => {
  const active = Tabs.useIsViewActive(ContentViewsViewName);

  // Open the content views view
  function handleClick() {
    Events.dispatch(OpenContentViewsViewEvent);
  }

  return (
    <MenuItem
      muted
      active={active}
      icon={ContentViews.constants.Icon}
      label="contentViews.labels.views"
      onClick={handleClick}
    />
  );
};
