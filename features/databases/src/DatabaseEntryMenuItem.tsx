import { DatabaseEntries } from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { Tabs } from '@minddrop/feature-views';
import {
  MenuContents,
  MenuItem,
  MenuItemPopoverContext,
} from '@minddrop/ui-primitives';
import { DatabaseEntryViewName } from './events';
import { resolveDatabaseEntryViewId } from './utils';

export interface DatabaseEntryMenuItemProps {
  /**
   * The ID of the entry the item opens.
   */
  entryId: string;

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
 * Renders a sidebar menu item which opens a database entry's view,
 * shown with the entry's icon.
 */
export const DatabaseEntryMenuItem: React.FC<DatabaseEntryMenuItemProps> = ({
  entryId,
  menu,
  popovers,
}) => {
  const entry = DatabaseEntries.use(entryId);
  const active = Tabs.useIsViewActive(DatabaseEntryViewName, {
    viewId: resolveDatabaseEntryViewId(entryId),
  });

  function handleClick() {
    Events.dispatch(DatabaseEntries.events.OpenView, { entryId });
  }

  if (!entry) {
    return null;
  }

  return (
    <MenuItem
      muted
      active={active}
      menu={menu}
      popovers={popovers}
      contentIcon={DatabaseEntries.resolveIcon(entry)}
      onClick={handleClick}
    >
      {entry.title}
    </MenuItem>
  );
};
