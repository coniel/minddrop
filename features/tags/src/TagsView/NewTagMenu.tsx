import { useRef, useState } from 'react';
import { TagGroup, TagGroupsIcon } from '@minddrop/tags';
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
} from '@minddrop/ui-primitives';
import { NewTagPopover } from './NewTagPopover';
import { TagGroupNamePopover } from './TagGroupNamePopover';

export interface NewTagMenuProps {
  /**
   * The tag groups a new tag can be created into.
   */
  groups: TagGroup[];

  /**
   * Callback fired with the group name when the new group naming
   * is committed.
   */
  onCreateGroup: (name: string) => void;
}

/**
 * Renders the add button's dropdown menu: actions creating a new
 * tag or tag group, and one creating a tag directly into each
 * existing group. The creation actions swap the menu for form
 * popovers.
 */
export const NewTagMenu: React.FC<NewTagMenuProps> = ({
  groups,
  onCreateGroup,
}) => {
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const [namingGroup, setNamingGroup] = useState(false);
  const [creatingTag, setCreatingTag] = useState(false);
  const [tagGroup, setTagGroup] = useState<TagGroup | undefined>(undefined);

  // Open the new tag form, preselecting the given group
  function handleCreateTag(group?: TagGroup) {
    setTagGroup(group);
    setCreatingTag(true);
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
                icon={TagGroupsIcon}
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
                        icon={TagGroupsIcon}
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
      <TagGroupNamePopover
        open={namingGroup}
        onOpenChange={setNamingGroup}
        anchor={addButtonRef}
        onSubmit={onCreateGroup}
      />
    </>
  );
};
