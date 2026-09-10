import { EntityGroup, EntityGroups } from '@minddrop/entity-groups';
import { SidebarGroupsType } from './constants';

/**
 * Reorders a sidebar group's items, listing them in the given ID
 * order.
 *
 * @param groupId - The ID of the group to reorder.
 * @param itemIds - The item IDs in the desired order.
 * @returns The updated group.
 *
 * @throws {EntityGroupNotFoundError} If the group does not exist.
 * @throws {ProtectedEntityGroupError} If the group is one the app provides.
 *
 * @dispatches entity-groups:group:updated
 */
export function reorderSidebarGroupItems(
  groupId: string,
  itemIds: string[],
): Promise<EntityGroup> {
  return EntityGroups.reorderItems(SidebarGroupsType, groupId, itemIds);
}
