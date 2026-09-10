import { EntityGroup, EntityGroups } from '@minddrop/entity-groups';
import { SidebarGroupsType } from './constants';

/**
 * Retrieves the sidebar's groups.
 *
 * @returns The groups in the order they are listed in the sidebar.
 */
export function useSidebarGroups(): EntityGroup[] {
  return EntityGroups.useAll(SidebarGroupsType);
}
