import { EntityGroup, EntityGroups } from '@minddrop/entity-groups';
import { SidebarGroupsType } from './constants';

/**
 * Moves an item from one sidebar group to another, as a drag between
 * them does. The databases group keeps the item, since it lists every
 * database whatever the user has grouped.
 *
 * @param fromGroupId - The ID of the group to move the item out of.
 * @param toGroupId - The ID of the group to move the item into.
 * @param itemId - The ID of the item to move.
 * @param index - The position to insert the item at, appending it when omitted.
 * @returns The updated target group.
 *
 * @throws {EntityGroupNotFoundError} If either group does not exist.
 * @throws {ProtectedEntityGroupError} If the target group is one the app provides.
 * @throws {UnsupportedEntityGroupItemError} If the item is not of a type a sidebar group can hold.
 *
 * @dispatches entity-groups:group:updated
 */
export function moveSidebarGroupItem(
  fromGroupId: string,
  toGroupId: string,
  itemId: string,
  index?: number,
): Promise<EntityGroup> {
  return EntityGroups.moveItem(
    SidebarGroupsType,
    fromGroupId,
    toGroupId,
    itemId,
    index,
  );
}
