import { ItemAddressesChangedEventData } from '@minddrop/item-references';
import { DataViews } from '@minddrop/views';
import { persistVirtualViewConfig } from '../../persistVirtualViewConfig';
import { getReferencingEntries } from '../../utils';
import { writeDatabaseEntry } from '../../writeDatabaseEntry';

/**
 * Rewrites entry files whose collection properties reference
 * changed items, and re-persists embedded view configs referencing
 * them, so their durable references stay current.
 *
 * @param changes - The item address changes.
 */
export async function onItemAddressesChanged(
  changes: ItemAddressesChangedEventData,
): Promise<void> {
  // Collect the changed item IDs
  const changedIds = changes.map((change) => change.id);

  // Find entries referencing the changed items
  const referencingEntries = getReferencingEntries(changedIds);

  // Rewrite each referencing entry's file
  await Promise.all(
    referencingEntries.map((entry) => writeDatabaseEntry(entry.id)),
  );

  // Re-persist embedded view configs referencing the changed items
  DataViews.getReferencing(changedIds)
    .filter((view) => view.virtual)
    .forEach(persistVirtualViewConfig);
}
