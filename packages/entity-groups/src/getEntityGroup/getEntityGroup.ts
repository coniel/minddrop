import { EntityGroupNotFoundError } from '../errors';
import { getAllEntityGroups } from '../getAllEntityGroups';
import { EntityGroup } from '../types';

/**
 * Retrieves a group from its type's groups by ID.
 *
 * @param type - The group's type.
 * @param id - The ID of the group.
 * @param throwOnNotFound - Whether to throw an error if the group is not found.
 * @returns The group.
 *
 * @throws {EntityGroupNotFoundError} If the group does not exist.
 */
export function getEntityGroup(type: string, id: string): EntityGroup;
export function getEntityGroup(
  type: string,
  id: string,
  throwOnNotFound: false,
): EntityGroup | null;
export function getEntityGroup(
  type: string,
  id: string,
  throwOnNotFound = true,
): EntityGroup | null {
  // Look for the group among its type's groups
  const group = getAllEntityGroups(type).find(
    (entityGroup) => entityGroup.id === id,
  );

  // Throw an error if it doesn't exist, unless specified not to
  if (!group && throwOnNotFound) {
    throw new EntityGroupNotFoundError(id);
  }

  return group ?? null;
}
