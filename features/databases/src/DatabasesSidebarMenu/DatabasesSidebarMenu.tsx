import { Database, Databases } from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { Tabs } from '@minddrop/feature-views';
import { SidebarGroup } from '@minddrop/ui-components';
import { MenuItem } from '@minddrop/ui-primitives';
import {
  DatabaseViewName,
  OpenDatabaseViewEvent,
  OpenNewDatabaseDialogEvent,
} from '../events';
import { resolveDatabaseViewId } from '../utils';

/** Renders the collapsible databases section in the app sidebar. */
export const DatabasesSidebarMenu: React.FC = () => {
  const databases = Databases.useAll();

  function handleAddDatabase() {
    Events.dispatch(OpenNewDatabaseDialogEvent);
  }

  return (
    <SidebarGroup
      label="databases.labels.databases"
      addLabel="databases.actions.new"
      onAddClick={handleAddDatabase}
    >
      {databases.map((database) => (
        <DatabaseMenuItem key={database.id} database={database} />
      ))}
    </SidebarGroup>
  );
};

interface DatabaseMenuItemProps {
  /**
   * The database the item opens.
   */
  database: Database;
}

/**
 * Renders a sidebar menu item which opens a database's view.
 */
const DatabaseMenuItem: React.FC<DatabaseMenuItemProps> = ({ database }) => {
  // The item is active while its database's view is shown, or while
  // showing something opened from it (e.g. one of its entries)
  const active = Tabs.useIsViewActive(DatabaseViewName, {
    viewId: resolveDatabaseViewId(database.id),
  });

  function handleClick() {
    Events.dispatch(OpenDatabaseViewEvent, { databaseId: database.id });
  }

  return (
    <MenuItem
      muted
      active={active}
      contentIcon={database.icon}
      onClick={handleClick}
    >
      {database.name}
    </MenuItem>
  );
};
