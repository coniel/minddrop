import { EntityGroup, EntityGroups } from '@minddrop/entity-groups';
import { SidebarGroupsType } from './constants';

/**
 * Retrieves the sidebar groups holding an item.
 *
 * @param itemId - The ID of the item.
 * @returns The groups holding the item, in the order they are listed.
 */
export function useSidebarGroupsForItem(itemId: string): EntityGroup[] {
  return EntityGroups.useForItem(SidebarGroupsType, itemId);
}
