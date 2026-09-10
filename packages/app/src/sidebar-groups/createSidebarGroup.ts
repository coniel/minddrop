import { EntityGroup, EntityGroups } from '@minddrop/entity-groups';
import { SidebarGroupsType } from './constants';

/**
 * Creates a new sidebar group, listing it above the existing ones.
 *
 * @param name - The name of the group.
 * @param items - The IDs of the items to list in the group.
 * @returns The created group.
 *
 * @throws {UnsupportedEntityGroupItemError} If an item is not of a type a sidebar group can hold.
 *
 * @dispatches entity-groups:group:created
 */
export function createSidebarGroup(
  name: string,
  items?: string[],
): Promise<EntityGroup> {
  return EntityGroups.create(SidebarGroupsType, name, items);
}
