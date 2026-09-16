import { EntityGroup, EntityGroups } from '@minddrop/entity-groups';

// The group is never stored, so it has no dates of its own
const NoDate = new Date(0);

/**
 * Resolves the type's items which none of its groups list. This is
 * what the ungrouped group shows.
 *
 * @param type - The group type.
 * @param groups - The type's groups.
 * @param itemIds - The IDs of the type's items, in the order they are listed.
 * @returns The ungrouped group.
 */
export function resolveUngroupedEntityGroup(
  type: string,
  groups: EntityGroup[],
  itemIds: string[],
): EntityGroup {
  // Collect the items the type's groups list
  const grouped = new Set(groups.flatMap(({ items }) => items));

  // Show the items none of them list
  return {
    id: EntityGroups.constants.UngroupedId,
    type,
    name: '',
    items: itemIds.filter((itemId) => !grouped.has(itemId)),
    created: NoDate,
    lastModified: NoDate,
  };
}
