import { CollectionsIcon } from '@minddrop/collections';
import { Events } from '@minddrop/events';
import { Tabs } from '@minddrop/feature-views';
import { MenuItem } from '@minddrop/ui-primitives';
import { CollectionsViewName, OpenCollectionsViewEvent } from './events';

/**
 * Renders the sidebar menu item which opens the collections view.
 */
export const CollectionsMenuItem: React.FC = () => {
  const active = Tabs.useIsViewActive(CollectionsViewName);

  // Open the collections view
  function handleClick() {
    Events.dispatch(OpenCollectionsViewEvent);
  }

  return (
    <MenuItem
      muted
      active={active}
      icon={CollectionsIcon}
      label="collections.labels.collections"
      onClick={handleClick}
    />
  );
};
