import { getTransferData } from '@minddrop/utils';
import { EntityGroupSourceDataKey } from '../../constants';

interface EntityGroupDragData {
  /**
   * The ID of the group the items were dragged out of.
   */
  [EntityGroupSourceDataKey]?: string;
}

/**
 * Returns the ID of the group the dragged items were dragged out
 * of, which the drag carries on its data transfer object, or null
 * when they came from outside a group list.
 *
 * @param event - The drag event which delivered the drop.
 * @returns The ID of the group the items came from.
 */
export function resolveEntityGroupDragSource(
  event: React.DragEvent | DragEvent,
): string | null {
  const data = getTransferData<EntityGroupDragData>(event);

  return data[EntityGroupSourceDataKey] ?? null;
}
