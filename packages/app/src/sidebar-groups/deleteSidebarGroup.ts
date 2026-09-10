import { EntityGroups } from '@minddrop/entity-groups';
import { SidebarGroupsType } from './constants';

/**
 * Deletes a sidebar group. Its items become ungrouped, and the
 * entities they point to are left untouched.
 *
 * @param id - The ID of the group to delete.
 *
 * @throws {EntityGroupNotFoundError} If the group does not exist.
 * @throws {ProtectedEntityGroupError} If the group is one the app provides.
 *
 * @dispatches entity-groups:group:deleted
 */
export function deleteSidebarGroup(id: string): Promise<void> {
  return EntityGroups.delete(SidebarGroupsType, id);
}
