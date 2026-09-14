import React, { useState } from 'react';
import { EntityGroups } from '@minddrop/entity-groups';
import {
  MenuContents,
  MenuItemConfig,
  MenuItemPopoverContext,
  NamePopover,
  SubmenuContents,
} from '@minddrop/ui-primitives';
import { useEntityGroupItem } from '../EntityGroupItemContext';
import { useEntityGroupList } from '../EntityGroupListContext';

export interface EntityGroupItemMenu {
  /**
   * The actions on the item's membership of the list's groups, to
   * place among the item's own menu contents.
   */
  menu: MenuContents;

  /**
   * Renders the popovers the actions open, to pass along with the
   * item's menu.
   */
  popovers: (context: MenuItemPopoverContext) => React.ReactNode;
}

// What becomes of the item once the group it is being put in has
// been named.
type NewGroupAction = 'move' | 'add';

/**
 * Returns the menu contents managing which of the list's groups an
 * item listed in one of them belongs to: removing it from the
 * group, moving it to another, and, for a type whose items can
 * belong to several groups, adding it to another. Each of the
 * latter two offers the user's groups not already holding the item,
 * and the making of a new one.
 *
 * An item listed in a group the app provides is not the user's to
 * remove or move, so it is offered adding alone.
 *
 * @returns The menu contents and the popovers they open.
 */
export function useEntityGroupItemMenu(): EntityGroupItemMenu {
  // Set while a new group is being named, to what the item does
  // once it exists.
  const [namingFor, setNamingFor] = useState<NewGroupAction | null>(null);
  const { groupId, itemId } = useEntityGroupItem();
  const { config, type } = useEntityGroupList();
  const groups = EntityGroups.useAll(type);
  const itemGroups = EntityGroups.useForItem(type, itemId);

  const isProtected = EntityGroups.isProtected(groupId, config);

  // The groups the item can be put in: the user's own, since the
  // contents of the app's groups are not the user's to change, and
  // not the ones already holding it, the one the menu was opened
  // from among them.
  const targetGroups = groups.filter(
    (group) =>
      !EntityGroups.isProtected(group.id, config) &&
      !itemGroups.some((itemGroup) => itemGroup.id === group.id),
  );

  const menu: MenuContents = [
    ...(isProtected
      ? []
      : ([
          {
            type: 'menu-item',
            icon: 'folder-minus',
            label: 'entityGroups.item.remove',
            onSelect: () => EntityGroups.removeItem(type, groupId, itemId),
          },
          {
            type: 'menu-item',
            icon: 'folder-input',
            label: 'entityGroups.item.move',
            submenu: resolveGroupsSubmenu('move'),
          },
        ] as MenuContents)),
    ...(config.multiMembership
      ? ([
          {
            type: 'menu-item',
            icon: 'folder-symlink',
            label: 'entityGroups.item.add',
            submenu: resolveGroupsSubmenu('add'),
          },
        ] as MenuContents)
      : []),
  ];

  // The user's groups, followed by the action which makes another
  // one.
  function resolveGroupsSubmenu(action: NewGroupAction): SubmenuContents {
    return [
      ...targetGroups.map(
        (group): MenuItemConfig => ({
          type: 'menu-item',
          stringLabel: group.name,
          onSelect: () => applyToGroup(group.id, action),
        }),
      ),
      {
        type: 'menu-item',
        icon: 'plus',
        label: 'entityGroups.labels.newGroup',
        onSelect: () => setNamingFor(action),
      },
    ];
  }

  // Create the group the item is being put in, and put it there.
  // The group is created empty so that the model applies its own
  // rules to the item as it goes in.
  async function handleCreateGroup(name: string) {
    const action = namingFor;

    if (!action) {
      return;
    }

    const group = await EntityGroups.create(type, name);

    applyToGroup(group.id, action);
  }

  // A move takes the item out of the group listing it; an add
  // leaves it there as well.
  function applyToGroup(targetGroupId: string, action: NewGroupAction) {
    if (action === 'move') {
      EntityGroups.moveItem(type, groupId, targetGroupId, itemId);

      return;
    }

    EntityGroups.addItem(type, targetGroupId, itemId);
  }

  // Abandoning the naming makes no group
  function handleNamingOpenChange(open: boolean) {
    if (!open) {
      setNamingFor(null);
    }
  }

  // Anchor the name popover where the menu which opened it was
  function popovers({ anchor }: MenuItemPopoverContext) {
    return (
      <NamePopover
        open={namingFor !== null}
        anchor={anchor}
        placeholder="entityGroups.name.placeholder"
        onOpenChange={handleNamingOpenChange}
        onSubmit={handleCreateGroup}
      />
    );
  }

  return { menu, popovers };
}
