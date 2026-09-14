import { Events } from '@minddrop/events';
import { Tabs } from '@minddrop/feature-views';
import { Spaces } from '@minddrop/spaces';
import {
  MenuContents,
  MenuItem,
  MenuItemPopoverContext,
} from '@minddrop/ui-primitives';
import { OpenSpaceViewEvent, SpaceViewName } from './events';
import { resolveSpaceViewId } from './utils';

export interface SpaceMenuItemProps {
  /**
   * The ID of the space the item opens.
   */
  spaceId: string;

  /**
   * The item's menu, opened both from a hover-revealed options
   * button and as the item's context menu.
   */
  menu?: MenuContents;

  /**
   * Popovers opened by the item's menu actions, anchored via the
   * given context.
   */
  popovers?: (context: MenuItemPopoverContext) => React.ReactNode;
}

/**
 * Renders a sidebar menu item which opens a space's view.
 */
export const SpaceMenuItem: React.FC<SpaceMenuItemProps> = ({
  spaceId,
  menu,
  popovers,
}) => {
  const space = Spaces.use(spaceId);
  const active = Tabs.useIsViewActive(SpaceViewName, {
    viewId: resolveSpaceViewId(spaceId),
  });

  function handleClick() {
    Events.dispatch(OpenSpaceViewEvent, { spaceId });
  }

  if (!space) {
    return null;
  }

  return (
    <MenuItem
      muted
      active={active}
      menu={menu}
      popovers={popovers}
      contentIcon={space.icon}
      onClick={handleClick}
    >
      {space.name}
    </MenuItem>
  );
};
