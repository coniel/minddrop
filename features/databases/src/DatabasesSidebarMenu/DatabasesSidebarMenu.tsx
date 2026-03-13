import { Databases } from '@minddrop/databases';
import { Events } from '@minddrop/events';
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  MenuGroup,
  MenuItem,
  MenuLabel,
  Stack,
} from '@minddrop/ui-primitives';
import { useActiveDatabaseId } from '../DatabasesFeatureState';
import {
  OpenDatabaseViewEvent,
  OpenDatabaseViewEventData,
  OpenNewDatabaseDialogEvent,
} from '../events';

/** Renders the collapsible databases section in the app sidebar. */
export const DatabasesSidebarMenu: React.FC = () => {
  const databases = Databases.useAll();
  const activeDatabaseId = useActiveDatabaseId();

  function handleAddDatabase(event: React.MouseEvent) {
    event.stopPropagation();
    Events.dispatch(OpenNewDatabaseDialogEvent);
  }

  function handleOpenDatabaseView(databaseId: string) {
    Events.dispatch<OpenDatabaseViewEventData>(OpenDatabaseViewEvent, {
      databaseId,
    });
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
                <MenuItem
                  muted
                  active={database.id === activeDatabaseId}
                  contentIcon={database.icon || 'content-icon:shapes:inherit'}
                  key={database.id}
                  onClick={() => handleOpenDatabaseView(database.id)}
                >
                  {database.name}
                </MenuItem>
              ))}
            </MenuGroup>
          </CollapsibleContent>
        </Collapsible>
      </MenuGroup>
    </div>
  );
};
