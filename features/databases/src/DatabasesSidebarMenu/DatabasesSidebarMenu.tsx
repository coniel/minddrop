import { Database, Databases } from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { Tabs } from '@minddrop/feature-views';
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  MenuGroup,
  MenuItem,
  MenuLabel,
} from '@minddrop/ui-primitives';
import {
  DatabaseViewName,
  OpenDatabaseViewEvent,
  OpenNewDatabaseDialogEvent,
} from '../events';
import { resolveDatabaseViewId } from '../utils';

/** Renders the collapsible databases section in the app sidebar. */
export const DatabasesSidebarMenu: React.FC = () => {
  const databases = Databases.useAll();

  function handleAddDatabase(event: React.MouseEvent) {
    event.stopPropagation();
    Events.dispatch(OpenNewDatabaseDialogEvent);
  }

  return (
    <div className="databases-sidebar-menu">
      <MenuGroup showLabelActionsOnHover>
        <Collapsible defaultOpen>
          <CollapsibleTrigger
            nativeButton={false}
            render={
              <MenuLabel
                button
                label="databases.labels.databases"
                style={{ marginBottom: 1 }}
                actions={
                  <Button
                    size="sm"
                    label="databases.actions.new"
                    variant="subtle"
                    color="primary"
                    startIcon="plus"
                    onClick={handleAddDatabase}
                  />
                }
              />
            }
          />
          <CollapsibleContent>
            <MenuGroup>
              {databases.map((database) => (
                <DatabaseMenuItem key={database.id} database={database} />
              ))}
            </MenuGroup>
          </CollapsibleContent>
        </Collapsible>
      </MenuGroup>
    </div>
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
      contentIcon={database.icon || 'content-icon:shapes:inherit'}
      onClick={handleClick}
    >
      {database.name}
    </MenuItem>
  );
};
