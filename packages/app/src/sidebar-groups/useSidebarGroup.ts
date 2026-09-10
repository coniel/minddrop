import { EntityGroup, EntityGroups } from '@minddrop/entity-groups';
import { SidebarGroupsType } from './constants';

/**
 * Retrieves a sidebar group by ID.
 *
 * @param id - The ID of the group to retrieve.
 * @returns The group, or null if it does not exist.
 */
export function useSidebarGroup(id: string): EntityGroup | null {
  return EntityGroups.use(SidebarGroupsType, id);
}
