import { useRef, useState } from 'react';
import { Events } from '@minddrop/events';
import { SpaceGroups, Spaces } from '@minddrop/spaces';
import {
  CreateEntityGroupMenuItem,
  CreateEntityGroupPopover,
} from '@minddrop/ui-entity-groups';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  IconButton,
  MenuGroup,
} from '@minddrop/ui-primitives';
import { OpenNewSpaceDialogEvent } from '../events';

/**
 * Renders the add button's dropdown menu: actions creating a new
 * space or space group.
 */
export const NewSpaceMenu: React.FC = () => {
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const [namingGroup, setNamingGroup] = useState(false);

  // Open the new space dialog, which creates the space
  function handleCreateSpace() {
    Events.dispatch(OpenNewSpaceDialogEvent);
  }

  return (
    <>
      <DropdownMenu
        trigger={
          <IconButton
            ref={addButtonRef}
            icon="plus"
            size="md"
            variant="subtle"
            label="spaces.actions.add"
          />
        }
      >
        <MenuGroup>
          <DropdownMenuItem
            icon={Spaces.constants.Icon}
            label="spaces.actions.new"
            onSelect={handleCreateSpace}
          />
          <DropdownMenuSeparator />
          <CreateEntityGroupMenuItem onSelect={() => setNamingGroup(true)} />
        </MenuGroup>
      </DropdownMenu>

      {/* Names the new group in place of the menu */}
      <CreateEntityGroupPopover
        type={SpaceGroups.constants.Type}
        open={namingGroup}
        onOpenChange={setNamingGroup}
        anchor={addButtonRef}
      />
    </>
  );
};
