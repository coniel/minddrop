import { getAllEntityGroups } from '../getAllEntityGroups';
import { EntityGroup } from '../types';
import { resolveEntityGroupsForItem } from '../utils';

/**
 * Retrieves a group type's groups which hold an item.
 *
 * @param type - The group type.
 * @param itemId - The ID of the item.
 * @returns The groups holding the item, in the order they are listed.
 */
export function getEntityGroupsForItem(
  type: string,
  itemId: string,
): EntityGroup[] {
  return resolveEntityGroupsForItem(itemId, getAllEntityGroups(type));
}
