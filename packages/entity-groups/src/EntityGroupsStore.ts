import { createObjectStore } from '@minddrop/stores';
import { EntityGroup, EntityGroupSet } from './types';

/**
 * The groups of each registered type, keyed by type ID. A type's
 * groups are held in the order they are listed.
 */
export const EntityGroupsStore = createObjectStore<EntityGroupSet>(
  'EntityGroups:Groups',
  'type',
  { scope: 'workspace' },
);

/**
 * Retrieves a group type's groups.
 *
 * @param type - The group type.
 * @returns The type's groups in the order they are listed.
 */
export function useEntityGroups(type: string): EntityGroup[] {
  return EntityGroupsStore.useItem(type)?.groups ?? [];
}

/**
 * Retrieves a group by ID.
 *
 * @param type - The group's type.
 * @param id - The ID of the group to retrieve.
 * @returns The group, or null if it does not exist.
 */
export function useEntityGroup(type: string, id: string): EntityGroup | null {
  const groups = useEntityGroups(type);

  return groups.find((group) => group.id === id) ?? null;
}
