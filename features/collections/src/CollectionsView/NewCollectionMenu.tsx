import { useRef, useState } from 'react';
import { CollectionGroups, Collections } from '@minddrop/collections';
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
 * collection or collection group.
 */
export const NewCollectionMenu: React.FC = () => {
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const [namingGroup, setNamingGroup] = useState(false);
  const setSubview = Views.useSetSubview();

  // Create a collection and show it
  async function handleCreateCollection() {
    const collection = await Collections.create();

    setSubview({ id: collection.id });
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
            label="collections.actions.add"
          />
        }
      >
        <MenuGroup>
          <DropdownMenuItem
            icon={Collections.constants.Icon}
            label="collections.actions.new"
            onSelect={handleCreateCollection}
          />
          <DropdownMenuSeparator />
          <CreateEntityGroupMenuItem onSelect={() => setNamingGroup(true)} />
        </MenuGroup>
      </DropdownMenu>

      {/* Names the new group in place of the menu */}
      <CreateEntityGroupPopover
        type={CollectionGroups.constants.Type}
        open={namingGroup}
        onOpenChange={setNamingGroup}
        anchor={addButtonRef}
      />
    </>
  );
};
