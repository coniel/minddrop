import { ItemAddressesChangedEventData } from '@minddrop/item-references';
import { getReferencingDataViews } from '../../getReferencingDataViews';
import { writeDataView } from '../../writeDataView';

/**
 * Rewrites persisted view files referencing changed items so their
 * durable references stay current.
 *
 * @param changes - The item address changes.
 */
export async function onItemAddressesChanged(
  changes: ItemAddressesChangedEventData,
): Promise<void> {
  // Find persisted views referencing the changed items
  const affectedViews = getReferencingDataViews(
    changes.map((change) => change.id),
  ).filter((view) => !view.virtual);

  // Rewrite each affected view's file
  await Promise.all(affectedViews.map((view) => writeDataView(view.id)));
}
