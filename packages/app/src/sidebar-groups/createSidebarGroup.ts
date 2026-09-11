import {
  CreateEntityGroupOptions,
  EntityGroup,
  EntityGroups,
} from '@minddrop/entity-groups';
import { SidebarGroupsType } from './constants';

/**
 * Creates a new sidebar group, listing it at the given position
 * among the existing ones.
 *
 * @param name - The name of the group.
 * @param options - Options for the created group.
 * @returns The created group.
 *
 * @throws {UnsupportedEntityGroupItemError} If an item is not of a type a sidebar group can hold.
 *
 * @dispatches entity-groups:group:created
 */
export function createSidebarGroup(
  name: string,
  options?: CreateEntityGroupOptions,
): Promise<EntityGroup> {
  return EntityGroups.create(SidebarGroupsType, name, options);
}
