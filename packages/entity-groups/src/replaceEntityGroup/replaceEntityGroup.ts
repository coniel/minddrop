import { Events } from '@minddrop/events';
import { EntityGroupUpdatedEvent } from '../events';
import { getAllEntityGroups } from '../getAllEntityGroups';
import { getEntityGroup } from '../getEntityGroup';
import { setEntityGroups } from '../setEntityGroups';
import { EntityGroup, UpdateEntityGroupData } from '../types';

/**
 * Replaces a group in the store without persisting it, so that a
 * change spanning two groups is written once.
 *
 * @param type - The group's type.
 * @param id - The ID of the group to replace.
 * @param data - The group data to merge in.
 * @returns The updated group.
 *
 * @throws {EntityGroupNotFoundError} If the group does not exist.
 *
 * @dispatches entity-groups:group:updated
 */
export function replaceEntityGroup(
  type: string,
  id: string,
  data: UpdateEntityGroupData & Partial<Pick<EntityGroup, 'items'>>,
): EntityGroup {
  // Get the group
  const group = getEntityGroup(type, id);

  // Generate the updated group object
  const updatedGroup: EntityGroup = { ...group, ...data };

  // Replace the group among its type's groups
  setEntityGroups(
    type,
    getAllEntityGroups(type).map((typeGroup) =>
      typeGroup.id === id ? updatedGroup : typeGroup,
    ),
  );

  // Dispatch the group updated event
  Events.dispatch(EntityGroupUpdatedEvent, {
    original: group,
    updated: updatedGroup,
  });

  return updatedGroup;
}
