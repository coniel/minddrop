import { ItemAddressesChangedEventData } from '@minddrop/item-references';
import { getReferencingDataViews } from '../../getReferencingDataViews';
import { writeDataView } from '../../writeDataView';

/**
 * Rewrites persisted view files referencing changed items so their
 * durable references stay current, in the workspace the items
 * belong to.
 *
 * @param event - The item address changes.
 */
export async function onItemAddressesChanged(
  event: ItemAddressesChangedEventData,
): Promise<void> {
  const { workspaceId, changes } = event;

  // Find persisted views referencing the changed items
  const affectedViews = getReferencingDataViews(
    changes.map((change) => change.id),
    workspaceId,
  ).filter((view) => !view.virtual);

  // Rewrite each affected view's file
  await Promise.all(
    affectedViews.map((view) => writeDataView(view.id, workspaceId)),
  );
}
