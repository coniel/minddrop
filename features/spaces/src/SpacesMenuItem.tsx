import { Events } from '@minddrop/events';
import { MenuItem } from '@minddrop/ui-primitives';
import { OpenSpacesViewEvent } from './events';

/**
 * Renders the sidebar menu item which opens the spaces view.
 */
export const SpacesMenuItem: React.FC = () => {
  // Open the spaces view
  function handleClick() {
    Events.dispatch(OpenSpacesViewEvent);
  }

  return (
    <MenuItem
      muted
      icon="shapes"
      label="spaces.labels.spaces"
      onClick={handleClick}
    />
  );
};
