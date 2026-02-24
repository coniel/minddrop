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
} from '@minddrop/ui-primitives';
import {
  OpenDatabaseViewEvent,
  OpenDatabaseViewEventData,
  OpenNewDatabaseDialogEvent,
} from '../events';

export const DatabasesSidebarMenu: React.FC = () => {
  const databases = Databases.useAll();

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
                actions={
                  <Button
                    size="sm"
                    label="databases.actions.new"
                    variant="subtle"
                    startIcon="plus"
                    onClick={handleAddDatabase}
                  />
                }
              />
            }
          />
          <CollapsibleContent>
            {databases.map((database) => (
              <MenuItem
                muted
                contentIcon={database.icon || 'content-icon:shapes:inherit'}
                key={database.id}
                onClick={() => handleOpenDatabaseView(database.id)}
              >
                {database.name}
              </MenuItem>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </MenuGroup>
    </div>
  );
};
