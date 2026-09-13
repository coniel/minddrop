import { ItemAddressesChangedEventData } from '@minddrop/item-references';
import { EntityGroupsStore } from '../../EntityGroupsStore';
import { resolveEntityGroupsForItem } from '../../utils';
import { writeEntityGroups } from '../../writeEntityGroups';

/**
 * Called when item addresses change. Rewrites the file of every
 * group type holding a changed item, in the workspace the items
 * belong to, so their durable item references stay current.
 *
 * @param event - The item address changes.
 */
export async function onItemAddressesChanged(
  event: ItemAddressesChangedEventData,
): Promise<void> {
  const { workspaceId, changes } = event;

  // Collect the changed item IDs
  const changedIds = new Set(changes.map((change) => change.id));

  // Find the types whose groups hold a changed item
  const affectedTypes = EntityGroupsStore.in(workspaceId)
    .getAllArray()
    .filter(({ groups }) =>
      [...changedIds].some(
        (itemId) => resolveEntityGroupsForItem(itemId, groups).length,
      ),
    )
    .map(({ type }) => type);

  // Rewrite each affected type's groups file
  await Promise.all(
    affectedTypes.map((type) => writeEntityGroups(type, workspaceId)),
  );
}
