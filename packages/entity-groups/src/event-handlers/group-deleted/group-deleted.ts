import {
  EntityGroupCollapsedStore,
  entityGroupCollapsedKey,
} from '../../EntityGroupCollapsedStore';
import { EntityGroup } from '../../types';

/**
 * Called when a group has been deleted. Forgets whether it was
 * collapsed, which nothing else would clear.
 *
 * @param group - The deleted group.
 */
export function onGroupDeleted(group: EntityGroup): void {
  EntityGroupCollapsedStore.reset(
    entityGroupCollapsedKey(group.type, group.id),
  );
}
