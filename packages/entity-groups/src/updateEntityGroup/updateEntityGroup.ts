import { EntityGroupTypesRegistry } from '../EntityGroupTypesRegistry';
import { ProtectedEntityGroupError } from '../errors';
import { replaceEntityGroup } from '../replaceEntityGroup';
import { EntityGroup, UpdateEntityGroupData } from '../types';
import { isProtectedEntityGroup } from '../utils';
import { writeEntityGroups } from '../writeEntityGroups';

/**
 * Updates a group.
 *
 * @param type - The group's type.
 * @param id - The ID of the group to update.
 * @param data - The group data.
 * @returns The updated group.
 *
 * @throws {NotRegisteredError} If the group type is not registered.
 * @throws {EntityGroupNotFoundError} If the group does not exist.
 * @throws {ProtectedEntityGroupError} If the group is one the app provides.
 *
 * @dispatches entity-groups:group:updated
 */
export async function updateEntityGroup(
  type: string,
  id: string,
  data: UpdateEntityGroupData,
): Promise<EntityGroup> {
  const config = EntityGroupTypesRegistry.get(type);

  // Check that the group is the user's to edit
  if (isProtectedEntityGroup(id, config)) {
    throw new ProtectedEntityGroupError(id);
  }

  // Replace the group, which throws when it does not exist
  const updatedGroup = replaceEntityGroup(type, id, data);

  // Write the type's groups to the file system
  await writeEntityGroups(type);

  return updatedGroup;
}
