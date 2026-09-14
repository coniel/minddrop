import { Events } from '@minddrop/events';
import { Tabs } from '@minddrop/feature-views';
import { Tags } from '@minddrop/tags';
import {
  MenuContents,
  MenuItem,
  MenuItemPopoverContext,
} from '@minddrop/ui-primitives';
import { TagsViewName } from '../events';

export interface TagMenuItemProps {
  /**
   * The ID of the tag the item opens.
   */
  tagId: string;

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
 * Renders a sidebar menu item which opens the tags view showing a
 * tag.
 */
export const TagMenuItem: React.FC<TagMenuItemProps> = ({
  tagId,
  menu,
  popovers,
}) => {
  const tag = Tags.use(tagId);
  const active = Tabs.useIsViewActive(TagsViewName, { subviewId: tagId });

  function handleClick() {
    Events.dispatch(Tags.events.OpenView, { tagId });
  }

  if (!tag) {
    return null;
  }

  return (
    <MenuItem
      muted
      active={active}
      menu={menu}
      popovers={popovers}
      contentIcon={tag.icon}
      onClick={handleClick}
    >
      {tag.name}
    </MenuItem>
  );
};
