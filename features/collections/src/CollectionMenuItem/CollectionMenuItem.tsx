import { Collections } from '@minddrop/collections';
import { Events } from '@minddrop/events';
import { Tabs } from '@minddrop/feature-views';
import {
  MenuContents,
  MenuItem,
  MenuItemPopoverContext,
} from '@minddrop/ui-primitives';
import { CollectionsViewName, OpenCollectionsViewEvent } from '../events';

export interface CollectionMenuItemProps {
  /**
   * The ID of the collection the item opens.
   */
  collectionId: string;

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
 * Renders a sidebar menu item which opens the collections view
 * showing a collection.
 */
export const CollectionMenuItem: React.FC<CollectionMenuItemProps> = ({
  collectionId,
  menu,
  popovers,
}) => {
  const collection = Collections.use(collectionId);
  const active = Tabs.useIsViewActive(CollectionsViewName, {
    subviewId: collectionId,
  });

  function handleClick() {
    Events.dispatch(OpenCollectionsViewEvent, { collectionId });
  }

  if (!collection) {
    return null;
  }

  return (
    <MenuItem
      muted
      active={active}
      menu={menu}
      popovers={popovers}
      contentIcon={Collections.constants.EntityDefaultIcon}
      onClick={handleClick}
    >
      {collection.name}
    </MenuItem>
  );
};
