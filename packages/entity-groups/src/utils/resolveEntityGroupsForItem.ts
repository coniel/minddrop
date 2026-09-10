import { EntityGroup } from '../types';

/**
 * Resolves which groups hold an item.
 *
 * @param itemId - The ID of the item.
 * @param groups - The groups to look through.
 * @returns The groups holding the item, in the order they are listed.
 */
export function resolveEntityGroupsForItem(
  itemId: string,
  groups: EntityGroup[],
): EntityGroup[] {
  // Filter for the groups listing the item
  return groups.filter((group) => group.items.includes(itemId));
}
