import { useCallback } from 'react';
import { EntityGroups } from '@minddrop/entity-groups';
import { Icon, MenuItemConfig, SubmenuContents } from '@minddrop/ui-primitives';

/**
 * Returns a function building the group submenu contents of an item
 * of an exclusive membership group type: the type's groups with the
 * one holding the item checked, below the option of no group at
 * all.
 *
 * @param type - The group type.
 * @returns A function returning an item's submenu contents.
 */
export function useEntityGroupSubmenu(
  type: string,
): (itemId: string) => SubmenuContents {
  const groups = EntityGroups.useAll(type);

  return useCallback(
    (itemId: string) => {
      // The group holding the item, of which there is at most one
      const groupId = EntityGroups.getForItem(type, itemId)[0]?.id ?? null;

      return [
        {
          type: 'menu-item',
          label: 'entityGroups.labels.none',
          trailingIcon: !groupId ? <Icon name="check" /> : undefined,
          onSelect: () => ungroupItem(type, groupId, itemId),
        },
        ...groups.map(
          (group): MenuItemConfig => ({
            type: 'menu-item',
            stringLabel: group.name,
            trailingIcon:
              group.id === groupId ? <Icon name="check" /> : undefined,
            onSelect: () => EntityGroups.addItem(type, group.id, itemId),
          }),
        ),
      ];
    },
    [type, groups],
  );
}

/**
 * Removes the item from the group holding it, if any.
 */
function ungroupItem(type: string, groupId: string | null, itemId: string) {
  if (groupId) {
    EntityGroups.removeItem(type, groupId, itemId);
  }
}
