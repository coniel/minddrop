import { getTransferData } from '@minddrop/utils';
import { EntityGroupSourceDataKey } from '../../constants';
import { EntityGroupDragSource } from '../../types';

interface EntityGroupDragData {
  /**
   * The group the items were dragged out of.
   */
  [EntityGroupSourceDataKey]?: EntityGroupDragSource;
}

/**
 * Returns the ID of the group of the given type the dragged items
 * were dragged out of, which the drag carries on its data transfer
 * object, or null when they came from outside the type's groups:
 * out of another type's group, or from no group at all.
 *
 * @param event - The drag event which delivered the drop.
 * @param type - The group type of the drop target.
 * @returns The ID of the group the items came from.
 */
export function resolveEntityGroupDragSource(
  event: React.DragEvent | DragEvent,
  type: string,
): string | null {
  const source =
    getTransferData<EntityGroupDragData>(event)[EntityGroupSourceDataKey];

  if (!source || source.type !== type) {
    return null;
  }

  return source.groupId;
}
