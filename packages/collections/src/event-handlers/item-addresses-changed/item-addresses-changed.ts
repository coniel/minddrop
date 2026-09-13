import { ItemAddressesChangedEventData } from '@minddrop/item-references';
import { CollectionsStore } from '../../CollectionsStore';
import { writeCollection } from '../../writeCollection';

/**
 * Rewrites persisted collection files containing changed items so
 * their durable member references stay current, in the workspace
 * the items belong to.
 *
 * @param event - The item address changes.
 */
export async function onItemAddressesChanged(
  event: ItemAddressesChangedEventData,
): Promise<void> {
  const { workspaceId, changes } = event;

  // Collect the changed item IDs
  const changedIds = new Set(changes.map((change) => change.id));

  // Find persisted collections containing changed items
  const affectedCollections = CollectionsStore.in(workspaceId)
    .getAllArray()
    .filter(
      (collection) =>
        !collection.virtual &&
        collection.items.some((id) => changedIds.has(id)),
    );

  // Rewrite each affected collection file
  await Promise.all(
    affectedCollections.map((collection) =>
      writeCollection(collection.id, workspaceId),
    ),
  );
}
