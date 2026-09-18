import { useRef, useState } from 'react';
import { Queries, QueryGroups } from '@minddrop/queries';
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
import { Views } from '@minddrop/views';

/**
 * Renders the add button's dropdown menu: actions creating a new
 * query or query group.
 */
export const NewQueryMenu: React.FC = () => {
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const [namingGroup, setNamingGroup] = useState(false);
  const setSubview = Views.useSetSubview();

  // Create a query and show it
  async function handleCreateQuery() {
    const query = await Queries.create();

    setSubview({ id: query.id });
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
            label="queries.actions.add"
          />
        }
      >
        <MenuGroup>
          <DropdownMenuItem
            icon={Queries.constants.Icon}
            label="queries.actions.new"
            onSelect={handleCreateQuery}
          />
          <DropdownMenuSeparator />
          <CreateEntityGroupMenuItem onSelect={() => setNamingGroup(true)} />
        </MenuGroup>
      </DropdownMenu>

      {/* Names the new group in place of the menu */}
      <CreateEntityGroupPopover
        type={QueryGroups.constants.Type}
        open={namingGroup}
        onOpenChange={setNamingGroup}
        anchor={addButtonRef}
      />
    </>
  );
};
