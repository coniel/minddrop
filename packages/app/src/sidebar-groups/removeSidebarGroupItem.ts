import { EntityGroup, EntityGroups } from '@minddrop/entity-groups';
import { SidebarGroupsType } from './constants';

/**
 * Removes an item from a sidebar group, ungrouping it.
 *
 * @param groupId - The ID of the group to remove the item from.
 * @param itemId - The ID of the item to remove.
 * @returns The updated group.
 *
 * @throws {EntityGroupNotFoundError} If the group does not exist.
 * @throws {ProtectedEntityGroupError} If the group is one the app provides.
 *
 * @dispatches entity-groups:group:updated
 */
export function removeSidebarGroupItem(
  groupId: string,
  itemId: string,
): Promise<EntityGroup> {
  return EntityGroups.removeItem(SidebarGroupsType, groupId, itemId);
}
