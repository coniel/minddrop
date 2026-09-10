import { EntityGroupTypesRegistry } from '../EntityGroupTypesRegistry';
import { ProtectedEntityGroupError } from '../errors';
import { getEntityGroup } from '../getEntityGroup';
import { replaceEntityGroup } from '../replaceEntityGroup';
import { EntityGroup } from '../types';
import { isProtectedEntityGroup } from '../utils';
import { writeEntityGroups } from '../writeEntityGroups';

/**
 * Removes an item from a group, ungrouping it.
 *
 * @param type - The group's type.
 * @param groupId - The ID of the group to remove the item from.
 * @param itemId - The ID of the item to remove.
 * @returns The updated group.
 *
 * @throws {NotRegisteredError} If the group type is not registered.
 * @throws {EntityGroupNotFoundError} If the group does not exist.
 * @throws {ProtectedEntityGroupError} If the group is one the app provides.
 *
 * @dispatches entity-groups:group:updated
 */
export async function removeEntityGroupItem(
  type: string,
  groupId: string,
  itemId: string,
): Promise<EntityGroup> {
  // Check that the group is the user's to edit
  if (isProtectedEntityGroup(groupId, EntityGroupTypesRegistry.get(type))) {
    throw new ProtectedEntityGroupError(groupId);
  }

  // Get the group
  const group = getEntityGroup(type, groupId);

  // Drop the item from the group's items
  const updatedGroup = replaceEntityGroup(type, groupId, {
    items: group.items.filter((id) => id !== itemId),
  });

  // Write the type's groups to the file system
  await writeEntityGroups(type);

  return updatedGroup;
}
