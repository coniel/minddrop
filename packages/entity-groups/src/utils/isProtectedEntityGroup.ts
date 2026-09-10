import { EntityGroupTypeConfig } from '../types';

/**
 * Checks whether a group is one the app provides.
 *
 * @param id - The ID of the group.
 * @param config - The config of the group's type.
 * @returns Whether the group is protected.
 */
export function isProtectedEntityGroup(
  id: string,
  config: EntityGroupTypeConfig,
): boolean {
  return (config.protectedGroups ?? []).some((group) => group.id === id);
}
