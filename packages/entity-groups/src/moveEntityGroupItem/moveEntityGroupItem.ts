import { EntityGroupTypesRegistry } from '../EntityGroupTypesRegistry';
import { ProtectedEntityGroupError } from '../errors';
import { getEntityGroup } from '../getEntityGroup';
import { replaceEntityGroup } from '../replaceEntityGroup';
import { EntityGroup } from '../types';
import {
  insertGroupItem,
  isProtectedEntityGroup,
  validateEntityGroupItem,
} from '../utils';
import { writeEntityGroups } from '../writeEntityGroups';

/**
 * Moves an item from one of a type's groups to another. An item the
 * target group already holds moves to the new position rather than
 * being listed twice, and leaves the group it came from either way.
 *
 * A protected group keeps the item, since its contents are derived
 * rather than stored, making the move a copy out of it.
 *
 * @param type - The groups' type.
 * @param fromGroupId - The ID of the group to move the item out of.
 * @param toGroupId - The ID of the group to move the item into.
 * @param itemId - The ID of the item to move.
 * @param index - The position to insert the item at, appending it when omitted.
 * @returns The updated target group.
 *
 * @throws {NotRegisteredError} If the group type is not registered.
 * @throws {EntityGroupNotFoundError} If either group does not exist.
 * @throws {ProtectedEntityGroupError} If the target group is one the app provides.
 * @throws {UnsupportedEntityGroupItemError} If the item is not of a type the group can hold.
 *
 * @dispatches entity-groups:group:updated
 */
export async function moveEntityGroupItem(
  type: string,
  fromGroupId: string,
  toGroupId: string,
  itemId: string,
  index?: number,
): Promise<EntityGroup> {
  const config = EntityGroupTypesRegistry.get(type);

  // Check that the target group is the user's to edit
  if (isProtectedEntityGroup(toGroupId, config)) {
    throw new ProtectedEntityGroupError(toGroupId);
  }

  // Check that the item is of a type the group can hold
  validateEntityGroupItem(itemId, config);

  // Get the groups the item moves between
  const fromGroup = getEntityGroup(type, fromGroupId);
  const toGroup = getEntityGroup(type, toGroupId);

  // Insert the item into the target group at the given index
  const items = insertGroupItem(toGroup.items, itemId, index);

  // Update the target group with its new items
  const updatedGroup = replaceEntityGroup(type, toGroupId, { items });

  // Remove the item from the group it came from. Moving within one
  // group is handled by the insert above, and a protected group goes
  // on listing the item.
  if (
    fromGroupId !== toGroupId &&
    !isProtectedEntityGroup(fromGroupId, config)
  ) {
    replaceEntityGroup(type, fromGroupId, {
      items: fromGroup.items.filter((id) => id !== itemId),
    });
  }

  // Write the type's groups to the file system
  await writeEntityGroups(type);

  return updatedGroup;
}
