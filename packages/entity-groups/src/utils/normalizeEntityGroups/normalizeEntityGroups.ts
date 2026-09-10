import { EntityGroup, EntityGroupTypeConfig } from '../../types';

/**
 * Normalizes a group type's stored groups, restoring the protected
 * groups to the state their config defines and appending any which
 * the stored list is missing. Stored protected groups keep their
 * position.
 *
 * @param groups - The type's stored groups.
 * @param config - The config of the group type.
 * @returns The normalized groups.
 */
export function normalizeEntityGroups(
  groups: EntityGroup[],
  config: EntityGroupTypeConfig,
): EntityGroup[] {
  const protectedGroups = config.protectedGroups ?? [];

  // Restore the protected groups, dropping the name and items a
  // stored one may carry since neither is the app's to keep.
  const normalized = groups.map((group) => {
    const protectedGroup = protectedGroups.find(({ id }) => id === group.id);

    return protectedGroup
      ? { ...protectedGroup, type: config.id, items: [] }
      : group;
  });

  // Append the protected groups the stored list is missing
  const missing = protectedGroups
    .filter(({ id }) => !normalized.some((group) => group.id === id))
    .map((protectedGroup) => ({
      ...protectedGroup,
      type: config.id,
      items: [],
    }));

  return [...normalized, ...missing];
}
