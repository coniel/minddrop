import { EntityGroup } from '@minddrop/entity-groups';
import { EntityGroupDropAction } from '../../types';

/**
 * Resolves a drop on the ungrouped group into the model calls which
 * carry it out. The dropped items leave every group of the type
 * holding them.
 *
 * @param groups - The type's groups.
 * @param itemIds - The IDs of the dropped items.
 * @returns The actions to apply, in the order they apply.
 */
export function resolveUngroupedEntityGroupDrop(
  groups: EntityGroup[],
  itemIds: string[],
): EntityGroupDropAction[] {
  // Take each dropped item out of every group listing it
  return groups.flatMap((group) =>
    group.items
      .filter((itemId) => itemIds.includes(itemId))
      .map((itemId) => ({
        action: 'remove-item' as const,
        groupId: group.id,
        itemId,
      })),
  );
}
