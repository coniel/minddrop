import { Events } from '@minddrop/events';
import { Tabs } from '@minddrop/feature-views';
import { Spaces } from '@minddrop/spaces';
import { MenuItem } from '@minddrop/ui-primitives';
import { OpenSpacesViewEvent, SpacesViewName } from './events';

/**
 * Renders the sidebar menu item which opens the spaces view.
 */
export const SpacesMenuItem: React.FC = () => {
  const active = Tabs.useIsViewActive(SpacesViewName);

  // Open the spaces view
  function handleClick() {
    Events.dispatch(OpenSpacesViewEvent);
  }

  return (
    <MenuItem
      muted
      active={active}
      icon={Spaces.constants.Icon}
      label="spaces.labels.spaces"
      onClick={handleClick}
    />
  );
};
