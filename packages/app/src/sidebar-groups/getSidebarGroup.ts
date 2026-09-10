import { EntityGroup, EntityGroups } from '@minddrop/entity-groups';
import { SidebarGroupsType } from './constants';

/**
 * Retrieves a sidebar group by ID.
 *
 * @param id - The ID of the group.
 * @param throwOnNotFound - Whether to throw an error if the group is not found.
 * @returns The group.
 *
 * @throws {EntityGroupNotFoundError} If the group does not exist.
 */
export function getSidebarGroup(id: string): EntityGroup;
export function getSidebarGroup(
  id: string,
  throwOnNotFound: false,
): EntityGroup | null;
export function getSidebarGroup(
  id: string,
  throwOnNotFound = true,
): EntityGroup | null {
  if (!throwOnNotFound) {
    return EntityGroups.get(SidebarGroupsType, id, false);
  }

  return EntityGroups.get(SidebarGroupsType, id);
}
