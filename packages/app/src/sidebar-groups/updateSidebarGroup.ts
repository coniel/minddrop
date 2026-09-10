import {
  EntityGroup,
  EntityGroups,
  UpdateEntityGroupData,
} from '@minddrop/entity-groups';
import { SidebarGroupsType } from './constants';

/**
 * Updates a sidebar group.
 *
 * @param id - The ID of the group to update.
 * @param data - The group data.
 * @returns The updated group.
 *
 * @throws {EntityGroupNotFoundError} If the group does not exist.
 * @throws {ProtectedEntityGroupError} If the group is one the app provides.
 *
 * @dispatches entity-groups:group:updated
 */
export function updateSidebarGroup(
  id: string,
  data: UpdateEntityGroupData,
): Promise<EntityGroup> {
  return EntityGroups.update(SidebarGroupsType, id, data);
}
