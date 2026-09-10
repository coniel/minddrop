import { EntityGroup, EntityGroups } from '@minddrop/entity-groups';
import { SidebarGroupsType } from './constants';

/**
 * Adds an item to a sidebar group. An item the group already holds
 * is moved to the new position, and the groups already holding it
 * keep it.
 *
 * @param groupId - The ID of the group to add the item to.
 * @param itemId - The ID of the item to add.
 * @param index - The position to insert the item at, appending it when omitted.
 * @returns The updated group.
 *
 * @throws {EntityGroupNotFoundError} If the group does not exist.
 * @throws {ProtectedEntityGroupError} If the group is one the app provides.
 * @throws {UnsupportedEntityGroupItemError} If the item is not of a type a sidebar group can hold.
 *
 * @dispatches entity-groups:group:updated
 */
export function addSidebarGroupItem(
  groupId: string,
  itemId: string,
  index?: number,
): Promise<EntityGroup> {
  return EntityGroups.addItem(SidebarGroupsType, groupId, itemId, index);
}
