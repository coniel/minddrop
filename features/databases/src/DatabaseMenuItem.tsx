import { Databases } from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { Tabs } from '@minddrop/feature-views';
import {
  MenuContents,
  MenuItem,
  MenuItemPopoverContext,
} from '@minddrop/ui-primitives';
import { DatabaseViewName } from './events';
import { resolveDatabaseViewId } from './utils';

export interface DatabaseMenuItemProps {
  /**
   * The ID of the database the item opens.
   */
  databaseId: string;

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
 * Renders a sidebar menu item which opens a database's view.
 */
export const DatabaseMenuItem: React.FC<DatabaseMenuItemProps> = ({
  databaseId,
  menu,
  popovers,
}) => {
  const database = Databases.use(databaseId);
  // The item is active while its database's view is shown, or while
  // showing something opened from it (e.g. one of its entries)
  const active = Tabs.useIsViewActive(DatabaseViewName, {
    viewId: resolveDatabaseViewId(databaseId),
  });

  function handleClick() {
    Events.dispatch(Databases.events.OpenView, { databaseId });
  }

  if (!database) {
    return null;
  }

  return (
    <MenuItem
      muted
      active={active}
      menu={menu}
      popovers={popovers}
      contentIcon={database.icon}
      onClick={handleClick}
    >
      {database.name}
    </MenuItem>
  );
};
