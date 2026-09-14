import { EntityGroupTypesRegistry } from '../EntityGroupTypesRegistry';
import { ProtectedEntityGroupError } from '../errors';
import { getAllEntityGroups } from '../getAllEntityGroups';
import { replaceEntityGroup } from '../replaceEntityGroup';
import { EntityGroup, UpdateEntityGroupData } from '../types';
import { isProtectedEntityGroup, validateEntityGroupName } from '../utils';
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
 * @throws {InvalidParameterError} If the name is empty.
 * @throws {DuplicateEntityGroupNameError} If another group of the type has the name.
 *
 * @dispatches entity-groups:group:updated
 */
export async function updateEntityGroup(
  type: string,
  id: string,
  data: UpdateEntityGroupData,
): Promise<EntityGroup> {
  const config = EntityGroupTypesRegistry.get(type);
  const update = { ...data };

  // Check that the group is the user's to edit
  if (isProtectedEntityGroup(id, config)) {
    throw new ProtectedEntityGroupError(id);
  }

  // Check that a new name is one the type's other groups do not have
  if (update.name !== undefined) {
    update.name = validateEntityGroupName(
      update.name,
      getAllEntityGroups(type),
      id,
    );
  }

  // Replace the group, which throws when it does not exist
  const updatedGroup = replaceEntityGroup(type, id, update);

  // Write the type's groups to the file system
  await writeEntityGroups(type);

  return updatedGroup;
}
