import { useRef, useState } from 'react';
import { EntityGroup } from '@minddrop/entity-groups';
import { TagGroups } from '@minddrop/tags';
import { resolveEntityGroupNameError } from '@minddrop/ui-entity-groups';
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  IconButton,
  NamePopover,
} from '@minddrop/ui-primitives';
import { NewTagPopover } from '../NewTagPopover';

export interface NewTagMenuProps {
  /**
   * The tag groups a new tag can be created into.
   */
  groups: EntityGroup[];
}

/**
 * Renders the add button's dropdown menu: actions creating a new
 * tag or tag group, and one creating a tag directly into each
 * existing group. The creation actions swap the menu for form
 * popovers.
 */
export const NewTagMenu: React.FC<NewTagMenuProps> = ({ groups }) => {
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const [namingGroup, setNamingGroup] = useState(false);
  const [creatingTag, setCreatingTag] = useState(false);
  const [tagGroup, setTagGroup] = useState<EntityGroup | undefined>(undefined);

  // Open the new tag form, preselecting the given group
  function handleCreateTag(group?: EntityGroup) {
    setTagGroup(group);
    setCreatingTag(true);
  }

  // Create the group with the committed name, or show an error if
  // the name is invalid.
  async function handleCreateGroup(name: string) {
    try {
      await TagGroups.create(name);
    } catch (error) {
      return resolveEntityGroupNameError(error);
    }
  }

  return (
    <>
      <DropdownMenuRoot>
        <DropdownMenuTrigger>
          <IconButton
            ref={addButtonRef}
            icon="plus"
            size="md"
            variant="subtle"
            label="tags.actions.add"
          />
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuPositioner side="bottom" align="start">
            <DropdownMenuContent>
              <DropdownMenuItem
                icon="tag"
                label="tags.actions.new"
                onSelect={() => handleCreateTag()}
              />
              <DropdownMenuItem
                icon={TagGroups.constants.Icon}
                label="tags.actions.newGroup"
                onSelect={() => setNamingGroup(true)}
              />

              {/* Creation directly into an existing group */}
              {groups.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuLabel label="tags.actions.newInGroup" />
                    {groups.map((group) => (
                      <DropdownMenuItem
                        key={group.id}
                        icon={TagGroups.constants.Icon}
                        stringLabel={group.name}
                        onSelect={() => handleCreateTag(group)}
                      />
                    ))}
                  </DropdownMenuGroup>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenuPositioner>
        </DropdownMenuPortal>
      </DropdownMenuRoot>

      {/* The new tag form in place of the menu */}
      <NewTagPopover
        open={creatingTag}
        onOpenChange={setCreatingTag}
        anchor={addButtonRef}
        defaultGroup={tagGroup}
      />

      {/* Names the new group in place of the menu */}
      <NamePopover
        open={namingGroup}
        onOpenChange={setNamingGroup}
        anchor={addButtonRef}
        placeholder="tags.groupName.placeholder"
        onSubmit={handleCreateGroup}
      />
    </>
  );
};
