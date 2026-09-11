import { DropPosition } from '@minddrop/selection';
import { EntityGroupDropAction } from '../../types';
import { resolveDropIndex } from '../resolveDropIndex';
import { resolveDropOrder } from '../resolveDropOrder';

export interface ResolveEntityGroupDropOptions {
  /**
   * Where the drop landed relative to the item it landed on, or
   * 'inside' when it landed on the group rather than one of its
   * items.
   */
  position: DropPosition;

  /**
   * The position of the item the drop landed on, omitted when it
   * landed on the group itself.
   */
  targetIndex?: number;

  /**
   * The ID of the group which received the drop.
   */
  targetGroupId: string;

  /**
   * The items the target group holds, in the order it lists them.
   */
  targetItems: string[];

  /**
   * The ID of the group the items were dragged out of, null when
   * they were dragged in from outside the list.
   */
  sourceGroupId: string | null;

  /**
   * The IDs of the dropped items.
   */
  itemIds: string[];
}

/**
 * Resolves a drop on a group into the model calls which carry it
 * out: a reorder within the group the items came from, a move
 * across groups, or an add for items dragged in from outside the
 * list.
 *
 * @param options - The drop to resolve.
 * @returns The actions to apply, in the order they apply.
 */
export function resolveEntityGroupDrop(
  options: ResolveEntityGroupDropOptions,
): EntityGroupDropAction[] {
  const {
    itemIds,
    position,
    sourceGroupId,
    targetGroupId,
    targetIndex,
    targetItems,
  } = options;

  if (!itemIds.length) {
    return [];
  }

  // The position the items landed at in the group as it currently
  // stands: after the item they were dropped below, and at the end
  // of the group when dropped on the group itself.
  const dropIndex = resolveTargetIndex(position, targetIndex, targetItems);

  // Items dropped in the group they came from are reordered within it
  if (sourceGroupId === targetGroupId) {
    return [
      {
        action: 'reorder-items',
        groupId: targetGroupId,
        itemIds: resolveDropOrder(targetItems, itemIds, dropIndex),
      },
    ];
  }

  // The position the items take in the group's resulting items,
  // which is where the model inserts them.
  const index = resolveDropIndex(targetItems, itemIds, dropIndex);

  // Items dragged in from outside the list join the group, keeping
  // wherever they came from.
  if (!sourceGroupId) {
    return itemIds.map((itemId, itemIndex) => ({
      action: 'add-item',
      groupId: targetGroupId,
      itemId,
      index: index + itemIndex,
    }));
  }

  // Items dragged out of another group move into this one
  return itemIds.map((itemId, itemIndex) => ({
    action: 'move-item',
    fromGroupId: sourceGroupId,
    toGroupId: targetGroupId,
    itemId,
    index: index + itemIndex,
  }));
}

/**
 * Returns the position a drop landed at in the target group's items
 * as they currently stand.
 */
function resolveTargetIndex(
  position: DropPosition,
  targetIndex: number | undefined,
  targetItems: string[],
): number {
  // A drop on the group itself lands at the end of its items
  if (position === 'inside' || targetIndex === undefined) {
    return targetItems.length;
  }

  return position === 'after' ? targetIndex + 1 : targetIndex;
}
