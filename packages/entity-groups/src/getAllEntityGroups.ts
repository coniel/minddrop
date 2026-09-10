import { EntityGroupsStore } from './EntityGroupsStore';
import { EntityGroup } from './types';

/**
 * Retrieves a group type's groups.
 *
 * @param type - The group type.
 * @returns The type's groups in the order they are listed.
 */
export function getAllEntityGroups(type: string): EntityGroup[] {
  return EntityGroupsStore.get(type)?.groups ?? [];
}
