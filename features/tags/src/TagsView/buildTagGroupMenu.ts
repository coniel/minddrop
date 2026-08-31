import { Events, OpenConfirmationDialogEvent } from '@minddrop/events';
import { TagGroup, TagGroups } from '@minddrop/tags';
import { MenuContents } from '@minddrop/ui-primitives';

export interface TagGroupMenuCallbacks {
  /**
   * Callback fired when the new tag action is selected.
   */
  onCreateTag: () => void;

  /**
   * Callback fired when the rename action is selected.
   */
  onRename: () => void;
}

/**
 * Builds a tag group's menu contents: creating a tag in the
 * group, renaming and deletion.
 *
 * @param group - The tag group the menu's actions apply to.
 * @param callbacks - The action callbacks.
 * @returns The menu contents.
 */
export function buildTagGroupMenu(
  group: TagGroup,
  callbacks: TagGroupMenuCallbacks,
): MenuContents {
  return [
    {
      type: 'menu-item',
      icon: 'tag',
      label: 'tags.actions.new',
      onSelect: callbacks.onCreateTag,
    },
    { type: 'menu-separator' },
    {
      type: 'menu-item',
      icon: 'pencil',
      label: 'tags.actions.renameGroup',
      onSelect: callbacks.onRename,
    },
    {
      type: 'menu-item',
      danger: true,
      icon: 'trash-2',
      label: 'tags.actions.deleteGroup.label',
      onSelect: () => confirmDeleteTagGroup(group),
    },
  ];
}

/**
 * Opens a delete confirmation noting that the group's tags become
 * ungrouped, deleting it on confirm.
 */
function confirmDeleteTagGroup(group: TagGroup) {
  Events.dispatch(OpenConfirmationDialogEvent, {
    title: 'tags.actions.deleteGroup.confirmation.title',
    message: 'tags.actions.deleteGroup.confirmation.message',
    confirmLabel: 'tags.actions.deleteGroup.confirmation.confirm',
    onConfirm: () => TagGroups.delete(group.id),
  });
}
