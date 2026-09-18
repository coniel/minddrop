import { DatabaseEntries } from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { Tag, TagGroups, Tags } from '@minddrop/tags';
import { MenuContents, SubmenuContents } from '@minddrop/ui-primitives';
import { ContentColors } from '@minddrop/ui-theme';

/**
 * Builds a tag's menu contents: renaming, color and group
 * selection submenus, and deletion.
 *
 * @param tag - The tag the menu's actions apply to.
 * @param groupSubmenu - The contents of the group selection submenu.
 * @param onRename - Callback fired when the rename action is selected.
 * @returns The menu contents.
 */
export function buildTagMenu(
  tag: Tag,
  groupSubmenu: SubmenuContents,
  onRename: () => void,
): MenuContents {
  return [
    {
      type: 'menu-item',
      icon: 'pencil',
      label: 'tags.actions.rename',
      onSelect: onRename,
    },
    {
      type: 'menu-item',
      icon: 'palette',
      label: 'tags.actions.color',
      submenu: buildColorSubmenu(tag),
    },
    {
      type: 'menu-item',
      icon: TagGroups.constants.Icon,
      label: 'tags.actions.group',
      submenu: groupSubmenu,
    },
    { type: 'menu-separator' },
    {
      type: 'menu-item',
      danger: true,
      icon: 'trash-2',
      label: 'tags.actions.delete.label',
      onSelect: () => deleteTag(tag),
    },
  ];
}

/**
 * Builds the color selection submenu, checking the tag's current
 * color.
 */
function buildColorSubmenu(tag: Tag): SubmenuContents {
  return ContentColors.map((color) => ({
    type: 'menu-color-selection-item',
    color,
    checked: color === tag.color,
    onSelect: () => Tags.update(tag.id, { color }),
  }));
}

/**
 * Deletes the tag, asking first when entries are tagged with it and
 * naming how many.
 */
function deleteTag(tag: Tag) {
  const count = DatabaseEntries.getTagged(tag.name).length;

  // Skip confirmation if tag has no consumers
  if (count === 0) {
    Tags.delete(tag.id);

    return;
  }

  Events.dispatch(Events.events.OpenConfirmationDialog, {
    title: 'tags.actions.delete.confirmation.title',
    message: 'tags.actions.delete.confirmation.message',
    values: { count },
    confirmLabel: 'tags.actions.delete.confirmation.confirm',
    danger: true,
    onConfirm: () => Tags.delete(tag.id),
  });
}
