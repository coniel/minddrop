import { Events } from '@minddrop/events';
import { reconcileIdOrder } from '@minddrop/utils';
import { EntityGroupsReorderedEvent } from '../events';
import { getAllEntityGroups } from '../getAllEntityGroups';
import { setEntityGroups } from '../setEntityGroups';
import { EntityGroup } from '../types';
import { writeEntityGroups } from '../writeEntityGroups';

/**
 * Reorders a group type's groups, listing them in the given ID
 * order. IDs which match no group are ignored, and groups missing
 * from the order are appended.
 *
 * @param type - The group type.
 * @param ids - The group IDs in the desired order.
 * @returns The type's groups in their new order.
 *
 * @dispatches entity-groups:groups:reordered
 */
export async function reorderEntityGroups(
  type: string,
  ids: string[],
): Promise<EntityGroup[]> {
  // Order the type's groups by the given IDs
  const groups = reconcileIdOrder(ids, getAllEntityGroups(type));

  // Update the type with its reordered groups
  setEntityGroups(type, groups);

  // Dispatch the groups reordered event
  Events.dispatch(EntityGroupsReorderedEvent, { type, groups });

  // Write the type's groups to the file system
  await writeEntityGroups(type);

  return groups;
}
