import { Events } from '@minddrop/events';
import { entityId } from '@minddrop/utils';
import { EntityGroupTypesRegistry } from '../EntityGroupTypesRegistry';
import { EntityGroupEntityType } from '../constants';
import { EntityGroupCreatedEvent } from '../events';
import { getAllEntityGroups } from '../getAllEntityGroups';
import { setEntityGroups } from '../setEntityGroups';
import { EntityGroup } from '../types';
import { validateEntityGroupItem, validateEntityGroupName } from '../utils';
import { writeEntityGroups } from '../writeEntityGroups';

export interface CreateEntityGroupOptions {
  /**
   * The IDs of the items to list in the group.
   */
  items?: string[];

  /**
   * The position to list the group at, listing it above the type's
   * existing groups when omitted.
   */
  index?: number;
}

/**
 * Creates a new group, listing it at the given position among the
 * type's existing ones.
 *
 * @param type - The group type to create the group in.
 * @param name - The name of the group.
 * @param options - Options for the created group.
 * @returns The created group.
 *
 * @throws {NotRegisteredError} If the group type is not registered.
 * @throws {InvalidParameterError} If the name is empty.
 * @throws {DuplicateEntityGroupNameError} If another group of the type has the name.
 * @throws {UnsupportedEntityGroupItemError} If an item is not of a type the group can hold.
 *
 * @dispatches entity-groups:group:created
 */
export async function createEntityGroup(
  type: string,
  name: string,
  options: CreateEntityGroupOptions = {},
): Promise<EntityGroup> {
  const { items = [], index = 0 } = options;
  const config = EntityGroupTypesRegistry.get(type);
  const groups = [...getAllEntityGroups(type)];

  // Check that the name is one the type's groups do not have
  const validatedName = validateEntityGroupName(name, groups);

  // Check that the items are of types the group can hold
  items.forEach((itemId) => validateEntityGroupItem(itemId, config));

  // Generate the group object, listing each item once
  const created = new Date();
  const group: EntityGroup = {
    id: entityId(EntityGroupEntityType),
    type,
    name: validatedName,
    items: [...new Set(items)],
    created,
    lastModified: created,
  };

  // Add the group to the store at the given position
  groups.splice(index, 0, group);
  setEntityGroups(type, groups);

  // Dispatch the group created event
  Events.dispatch(EntityGroupCreatedEvent, group);

  // Write the type's groups to the file system
  await writeEntityGroups(type);

  return group;
}
