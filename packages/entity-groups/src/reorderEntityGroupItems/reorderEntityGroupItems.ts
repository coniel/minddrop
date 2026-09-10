import { EntityGroupTypesRegistry } from '../EntityGroupTypesRegistry';
import { ProtectedEntityGroupError } from '../errors';
import { getEntityGroup } from '../getEntityGroup';
import { replaceEntityGroup } from '../replaceEntityGroup';
import { EntityGroup } from '../types';
import { isProtectedEntityGroup } from '../utils';
import { writeEntityGroups } from '../writeEntityGroups';

/**
 * Reorders a group's items, listing them in the given ID order. IDs
 * the group does not hold are ignored, and items missing from the
 * order are appended.
 *
 * @param type - The group's type.
 * @param groupId - The ID of the group to reorder.
 * @param itemIds - The item IDs in the desired order.
 * @returns The updated group.
 *
 * @throws {NotRegisteredError} If the group type is not registered.
 * @throws {EntityGroupNotFoundError} If the group does not exist.
 * @throws {ProtectedEntityGroupError} If the group is one the app provides.
 *
 * @dispatches entity-groups:group:updated
 */
export async function reorderEntityGroupItems(
  type: string,
  groupId: string,
  itemIds: string[],
): Promise<EntityGroup> {
  // Check that the group is the user's to edit
  if (isProtectedEntityGroup(groupId, EntityGroupTypesRegistry.get(type))) {
    throw new ProtectedEntityGroupError(groupId);
  }

  // Get the group
  const group = getEntityGroup(type, groupId);

  // Take the given order, dropping IDs the group does not hold
  const ordered = itemIds.filter((itemId) => group.items.includes(itemId));

  // Append the group's items which the order left out
  const missing = group.items.filter((itemId) => !ordered.includes(itemId));

  // Update the group with its reordered items
  const updatedGroup = replaceEntityGroup(type, groupId, {
    items: [...ordered, ...missing],
  });

  // Write the type's groups to the file system
  await writeEntityGroups(type);

  return updatedGroup;
}
