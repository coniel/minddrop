import { EntityGroups } from '@minddrop/entity-groups';
import { sidebarGroupsTypeConfig } from './sidebarGroupsTypeConfig';

/**
 * Checks whether a sidebar group is one the app provides, and so is
 * labelled by the app and cannot be edited.
 *
 * @param id - The ID of the group.
 * @returns Whether the group is protected.
 */
export function isProtectedSidebarGroup(id: string): boolean {
  return EntityGroups.isProtected(id, sidebarGroupsTypeConfig);
}
