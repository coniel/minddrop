import { EntityGroupTypesRegistry } from '../EntityGroupTypesRegistry';
import { ProtectedEntityGroupError } from '../errors';
import { getAllEntityGroups } from '../getAllEntityGroups';
import { getEntityGroup } from '../getEntityGroup';
import { replaceEntityGroup } from '../replaceEntityGroup';
import { EntityGroup } from '../types';
import {
  insertGroupItem,
  isProtectedEntityGroup,
  resolveEntityGroupsForItem,
  validateEntityGroupItem,
} from '../utils';
import { writeEntityGroups } from '../writeEntityGroups';

/**
 * Adds an item to a group. An item the group already holds is moved
 * to the new position. Unless the group's type allows multiple
 * membership, the item leaves the type's other groups.
 *
 * @param type - The group's type.
 * @param groupId - The ID of the group to add the item to.
 * @param itemId - The ID of the item to add.
 * @param index - The position to insert the item at, appending it when omitted.
 * @returns The updated group.
 *
 * @throws {NotRegisteredError} If the group type is not registered.
 * @throws {EntityGroupNotFoundError} If the group does not exist.
 * @throws {ProtectedEntityGroupError} If the group is one the app provides.
 * @throws {UnsupportedEntityGroupItemError} If the item is not of a type the group can hold.
 *
 * @dispatches entity-groups:group:updated
 */
export async function addEntityGroupItem(
  type: string,
  groupId: string,
  itemId: string,
  index?: number,
): Promise<EntityGroup> {
  const config = EntityGroupTypesRegistry.get(type);

  // Check that the group is the user's to edit
  if (isProtectedEntityGroup(groupId, config)) {
    throw new ProtectedEntityGroupError(groupId);
  }

  // Check that the item is of a type the group can hold
  validateEntityGroupItem(itemId, config);

  // Get the group
  const group = getEntityGroup(type, groupId);

  // Remove the item from the type's other groups, unless the type
  // lets an item belong to several.
  if (!config.multiMembership) {
    resolveEntityGroupsForItem(itemId, getAllEntityGroups(type))
      .filter((other) => other.id !== groupId)
      .forEach((other) =>
        replaceEntityGroup(type, other.id, {
          items: other.items.filter((id) => id !== itemId),
        }),
      );
  }

  // Insert the item at the given index
  const items = insertGroupItem(group.items, itemId, index);

  // Update the group with its new items
  const updatedGroup = replaceEntityGroup(type, groupId, { items });

  // Write the type's groups to the file system
  await writeEntityGroups(type);

  return updatedGroup;
}
