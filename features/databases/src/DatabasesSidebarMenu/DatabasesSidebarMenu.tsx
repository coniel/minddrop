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

  function handleAddItemType(event: React.MouseEvent) {
    event.stopPropagation();
    Events.dispatch(OpenNewDatabaseDialogEvent);
  }

  function handleOpenDatabaseView(name: string) {
    Events.dispatch<OpenDatabaseViewEventData>(OpenDatabaseViewEvent, { name });
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
                    size="small"
                    label="databases.actions.new"
                    variant="text"
                    startIcon="plus"
                    onClick={handleAddItemType}
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
                key={database.name}
                onClick={() => handleOpenDatabaseView(database.name)}
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
