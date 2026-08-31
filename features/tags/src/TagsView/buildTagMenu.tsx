import { DatabaseEntries } from '@minddrop/databases';
import { Events, OpenConfirmationDialogEvent } from '@minddrop/events';
import { i18n } from '@minddrop/i18n';
import { Tag, TagGroup, TagGroupsIcon, Tags } from '@minddrop/tags';
import {
  Icon,
  MenuContents,
  MenuItemConfig,
  SubmenuContents,
} from '@minddrop/ui-primitives';
import { ContentColors } from '@minddrop/ui-theme';

/**
 * Builds a tag's menu contents: renaming, color and group
 * selection submenus, and deletion.
 *
 * @param tag - The tag the menu's actions apply to.
 * @param groups - The tag groups offered by the group submenu.
 * @param onRename - Callback fired when the rename action is selected.
 * @returns The menu contents.
 */
export function buildTagMenu(
  tag: Tag,
  groups: TagGroup[],
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
      icon: TagGroupsIcon,
      label: 'tags.actions.group',
      submenu: buildGroupSubmenu(tag, groups),
    },
    { type: 'menu-separator' },
    {
      type: 'menu-item',
      danger: true,
      icon: 'trash-2',
      label: 'tags.actions.delete.label',
      onSelect: () => confirmDeleteTag(tag),
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
 * Builds the group selection submenu, checking the tag's current
 * group.
 */
function buildGroupSubmenu(tag: Tag, groups: TagGroup[]): SubmenuContents {
  return [
    {
      type: 'menu-item',
      label: 'tags.details.groupNone',
      trailingIcon: !tag.group ? <Icon name="check" /> : undefined,
      onSelect: () => Tags.update(tag.id, { group: null }),
    },
    ...groups.map(
      (group): MenuItemConfig => ({
        type: 'menu-item',
        stringLabel: group.name,
        trailingIcon:
          tag.group === group.id ? <Icon name="check" /> : undefined,
        onSelect: () => Tags.update(tag.id, { group: group.id }),
      }),
    ),
  ];
}

/**
 * Opens a delete confirmation noting how many entries reference
 * the tag, deleting it on confirm.
 */
function confirmDeleteTag(tag: Tag) {
  const count = DatabaseEntries.getTagged(tag.name).length;

  // Pick the plural form matching the count
  const messageKey =
    count === 1
      ? 'tags.actions.delete.confirmation.message_one'
      : 'tags.actions.delete.confirmation.message_other';

  Events.dispatch(OpenConfirmationDialogEvent, {
    title: 'tags.actions.delete.confirmation.title',
    message: <>{i18n.t(messageKey, { count })}</>,
    confirmLabel: 'tags.actions.delete.confirmation.confirm',
    onConfirm: () => Tags.delete(tag.id),
  });
}
