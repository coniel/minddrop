import { Events } from '@minddrop/events';
import { EntityGroupTypesRegistry } from '../EntityGroupTypesRegistry';
import { ProtectedEntityGroupError } from '../errors';
import { EntityGroupDeletedEvent } from '../events';
import { getAllEntityGroups } from '../getAllEntityGroups';
import { getEntityGroup } from '../getEntityGroup';
import { setEntityGroups } from '../setEntityGroups';
import { isProtectedEntityGroup } from '../utils';
import { writeEntityGroups } from '../writeEntityGroups';

/**
 * Deletes a group. Its items become ungrouped, and the entities they
 * point to are left untouched.
 *
 * @param type - The group's type.
 * @param id - The ID of the group to delete.
 *
 * @throws {NotRegisteredError} If the group type is not registered.
 * @throws {EntityGroupNotFoundError} If the group does not exist.
 * @throws {ProtectedEntityGroupError} If the group is one the app provides.
 *
 * @dispatches entity-groups:group:deleted
 */
export async function deleteEntityGroup(
  type: string,
  id: string,
): Promise<void> {
  const config = EntityGroupTypesRegistry.get(type);

  // Check that the group is the user's to delete
  if (isProtectedEntityGroup(id, config)) {
    throw new ProtectedEntityGroupError(id);
  }

  // Get the group
  const group = getEntityGroup(type, id);

  // Drop the group from its type's groups
  setEntityGroups(
    type,
    getAllEntityGroups(type).filter((typeGroup) => typeGroup.id !== id),
  );

  // Dispatch the group deleted event
  Events.dispatch(EntityGroupDeletedEvent, group);

  // Write the type's groups to the file system
  await writeEntityGroups(type);
}
