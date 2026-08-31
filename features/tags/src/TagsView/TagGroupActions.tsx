import { useRef, useState } from 'react';
import { Events, OpenConfirmationDialogEvent } from '@minddrop/events';
import { TagGroup, TagGroups } from '@minddrop/tags';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  IconButton,
} from '@minddrop/ui-primitives';
import { TagGroupNamePopover } from './TagGroupNamePopover';

export interface TagGroupActionsProps {
  /**
   * The tag group the actions apply to.
   */
  group: TagGroup;

  /**
   * Callback fired when the new tag action is selected.
   */
  onCreateTag: () => void;
}

/**
 * Renders a tag group's actions menu. The rename action swaps
 * the menu for a naming popover.
 */
export const TagGroupActions: React.FC<TagGroupActionsProps> = ({
  group,
  onCreateTag,
}) => {
  const optionsButtonRef = useRef<HTMLButtonElement>(null);
  const [renaming, setRenaming] = useState(false);

  // Persist the new name, ignoring names already in use
  async function handleRename(name: string) {
    // The name is unchanged
    if (name === group.name) {
      return;
    }

    try {
      await TagGroups.update(group.id, { name });
    } catch {
      // The name is already in use, keep the current one
    }
  }

  // Confirm before deleting the group
  function handleDelete() {
    Events.dispatch(OpenConfirmationDialogEvent, {
      title: 'tags.actions.deleteGroup.confirmation.title',
      message: 'tags.actions.deleteGroup.confirmation.message',
      confirmLabel: 'tags.actions.deleteGroup.confirmation.confirm',
      onConfirm: () => TagGroups.delete(group.id),
    });
  }

  return (
    <>
      <DropdownMenuRoot>
        <DropdownMenuTrigger>
          <IconButton
            ref={optionsButtonRef}
            icon="ellipsis"
            size="sm"
            variant="subtle"
            color="neutral"
            label="tags.actions.groupOptions"
          />
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuPositioner side="bottom" align="start">
            <DropdownMenuContent>
              <DropdownMenuItem
                icon="tag"
                label="tags.actions.new"
                onSelect={onCreateTag}
              />
              <DropdownMenuSeparator />
              <DropdownMenuItem
                icon="pencil"
                label="tags.actions.renameGroup"
                onSelect={() => setRenaming(true)}
              />
              <DropdownMenuItem
                danger
                icon="trash-2"
                label="tags.actions.deleteGroup.label"
                onSelect={handleDelete}
              />
            </DropdownMenuContent>
          </DropdownMenuPositioner>
        </DropdownMenuPortal>
      </DropdownMenuRoot>

      {/* Renames the group in place of the menu */}
      <TagGroupNamePopover
        open={renaming}
        onOpenChange={setRenaming}
        anchor={optionsButtonRef}
        defaultName={group.name}
        onSubmit={handleRename}
      />
    </>
  );
};
