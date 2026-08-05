import { Events } from '@minddrop/events';
import { Spaces } from '@minddrop/spaces';
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
  OpenNewSpaceDialogEvent,
  OpenSpaceViewEvent,
  OpenSpaceViewEventData,
} from '../events';

/**
 * Renders the collapsible spaces section in the app sidebar.
 */
export const SpacesSidebarMenu: React.FC = () => {
  const spaces = Spaces.useAll();

  function handleAddSpace(event: React.MouseEvent) {
    event.stopPropagation();
    Events.dispatch(OpenNewSpaceDialogEvent);
  }

  function handleOpenSpaceView(spaceId: string) {
    Events.dispatch<OpenSpaceViewEventData>(OpenSpaceViewEvent, { spaceId });
  }

  return (
    <div className="spaces-sidebar-menu">
      <MenuGroup showLabelActionsOnHover>
        <Collapsible defaultOpen>
          <CollapsibleTrigger
            nativeButton={false}
            render={
              <MenuLabel
                button
                label="spaces.labels.spaces"
                style={{ marginBottom: 1 }}
                actions={
                  <Button
                    size="sm"
                    label="spaces.actions.new"
                    variant="subtle"
                    color="primary"
                    startIcon="plus"
                    onClick={handleAddSpace}
                  />
                }
              />
            }
          />
          <CollapsibleContent>
            <MenuGroup>
              {spaces.map((space) => (
                <MenuItem
                  muted
                  contentIcon={space.icon}
                  key={space.id}
                  onClick={() => handleOpenSpaceView(space.id)}
                >
                  {space.name}
                </MenuItem>
              ))}
            </MenuGroup>
          </CollapsibleContent>
        </Collapsible>
      </MenuGroup>
    </div>
  );
};
