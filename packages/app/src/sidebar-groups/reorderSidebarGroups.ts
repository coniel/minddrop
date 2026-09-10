import { EntityGroup, EntityGroups } from '@minddrop/entity-groups';
import { SidebarGroupsType } from './constants';

/**
 * Reorders the sidebar's groups, listing them in the given ID order.
 * The groups the app provides are ordered among the user's own.
 *
 * @param ids - The group IDs in the desired order.
 * @returns The groups in their new order.
 *
 * @dispatches entity-groups:groups:reordered
 */
export function reorderSidebarGroups(ids: string[]): Promise<EntityGroup[]> {
  return EntityGroups.reorder(SidebarGroupsType, ids);
}
