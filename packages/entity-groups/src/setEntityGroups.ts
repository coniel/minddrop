import { EntityGroupsStore } from './EntityGroupsStore';
import { EntityGroup } from './types';

/**
 * Replaces a group type's groups in the store without persisting
 * them, so that a change spanning two groups is written once.
 *
 * @param type - The group type.
 * @param groups - The type's groups, in the order they are listed.
 */
export function setEntityGroups(type: string, groups: EntityGroup[]): void {
  EntityGroupsStore.set({ type, groups });
}
