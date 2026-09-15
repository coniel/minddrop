import { ContentViews } from '@minddrop/content-views';
import { Events } from '@minddrop/events';
import { Tabs } from '@minddrop/feature-views';
import {
  MenuContents,
  MenuItem,
  MenuItemPopoverContext,
} from '@minddrop/ui-primitives';
import { ContentViewViewName, OpenContentViewViewEvent } from './events';
import { resolveContentViewViewId } from './utils';

export interface ContentViewMenuItemProps {
  /**
   * The ID of the content view the item opens.
   */
  contentViewId: string;

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
 * Renders a sidebar menu item which opens a content view's view.
 */
export const ContentViewMenuItem: React.FC<ContentViewMenuItemProps> = ({
  contentViewId,
  menu,
  popovers,
}) => {
  const contentView = ContentViews.use(contentViewId);
  const active = Tabs.useIsViewActive(ContentViewViewName, {
    viewId: resolveContentViewViewId(contentViewId),
  });

  function handleClick() {
    Events.dispatch(OpenContentViewViewEvent, { contentViewId });
  }

  if (!contentView) {
    return null;
  }

  return (
    <MenuItem
      muted
      active={active}
      menu={menu}
      popovers={popovers}
      contentIcon={contentView.icon}
      onClick={handleClick}
    >
      {contentView.name}
    </MenuItem>
  );
};
