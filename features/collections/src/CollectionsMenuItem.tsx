import { Events } from '@minddrop/events';
import { MenuItem } from '@minddrop/ui-primitives';
import { OpenCollectionsViewEvent } from './events';

/**
 * Renders the sidebar menu item which opens the collections view.
 */
export const CollectionsMenuItem: React.FC = () => {
  // Open the collections view
  function handleClick() {
    Events.dispatch(OpenCollectionsViewEvent);
  }

  return (
    <MenuItem
      muted
      icon="library"
      label="collections.labels.collections"
      onClick={handleClick}
    />
  );
};
