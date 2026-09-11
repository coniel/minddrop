import { EntityGroups } from '@minddrop/entity-groups';
import { EntityGroupDropAction } from '../types';

/**
 * Applies the model calls a drop resolved to, one after the other
 * so that each lands in the list the one before it left behind.
 *
 * @param type - The groups' type.
 * @param actions - The actions to apply, in the order they apply.
 *
 * @throws {NotRegisteredError} If the group type is not registered.
 * @throws {EntityGroupNotFoundError} If a group does not exist.
 * @throws {ProtectedEntityGroupError} If a target group is one the app provides.
 * @throws {UnsupportedEntityGroupItemError} If an item is not of a type the group can hold.
 *
 * @dispatches entity-groups:group:updated
 */
export async function applyEntityGroupDrop(
  type: string,
  actions: EntityGroupDropAction[],
): Promise<void> {
  for (const action of actions) {
    await applyAction(type, action);
  }
}

/**
 * Applies a single action to the model.
 */
function applyAction(
  type: string,
  action: EntityGroupDropAction,
): Promise<unknown> {
  if (action.action === 'reorder-items') {
    return EntityGroups.reorderItems(type, action.groupId, action.itemIds);
  }

  if (action.action === 'move-item') {
    return EntityGroups.moveItem(
      type,
      action.fromGroupId,
      action.toGroupId,
      action.itemId,
      action.index,
    );
  }

  return EntityGroups.addItem(
    type,
    action.groupId,
    action.itemId,
    action.index,
  );
}
