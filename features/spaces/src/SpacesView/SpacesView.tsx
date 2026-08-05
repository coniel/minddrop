import { Events } from '@minddrop/events';
import { Spaces } from '@minddrop/spaces';
import { PanelView } from '@minddrop/ui-components';
import { MenuGroup, MenuItem, ScrollArea } from '@minddrop/ui-primitives';
import {
  OpenNewSpaceDialogEvent,
  OpenSpaceViewEvent,
  OpenSpaceViewEventData,
} from '../events';
import './SpacesView.css';

/**
 * Renders a panel view listing all spaces.
 */
export const SpacesView: React.FC = () => {
  const spaces = Spaces.useAll();

  // Open the new space dialog
  function handleAddSpace() {
    Events.dispatch(OpenNewSpaceDialogEvent);
  }

  // Open the clicked space's view
  function handleOpenSpaceView(spaceId: string) {
    Events.dispatch<OpenSpaceViewEventData>(OpenSpaceViewEvent, { spaceId });
  }

  return (
    <PanelView
      className="spaces-view"
      icon="shapes"
      title="spaces.labels.spaces"
      actions={[
        {
          icon: 'plus',
          label: 'spaces.actions.new',
          onClick: handleAddSpace,
        },
      ]}
    >
      {/* The list of spaces */}
      <ScrollArea className="spaces-view-content">
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
      </ScrollArea>
    </PanelView>
  );
};
