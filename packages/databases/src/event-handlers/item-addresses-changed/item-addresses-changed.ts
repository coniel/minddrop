import { ItemAddressesChangedEventData } from '@minddrop/item-references';
import { getReferencingEntries } from '../../utils';
import { writeDatabaseEntry } from '../../writeDatabaseEntry';

/**
 * Rewrites entry files whose collection properties reference
 * changed items so their durable references stay current.
 *
 * @param changes - The item address changes.
 */
export async function onItemAddressesChanged(
  changes: ItemAddressesChangedEventData,
): Promise<void> {
  // Find entries referencing the changed items
  const referencingEntries = getReferencingEntries(
    changes.map((change) => change.id),
  );

  // Rewrite each referencing entry's file
  await Promise.all(
    referencingEntries.map((entry) => writeDatabaseEntry(entry.id)),
  );
}
