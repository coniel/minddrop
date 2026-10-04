import { ItemAddressesChangedEventData } from '@minddrop/item-references';
import { recordEntriesReferenceRename } from '../../recordEntriesReferenceRename';
import { getReferencingEntries } from '../../utils';
import { writeEntry } from '../../writeEntry';

/**
 * Rewrites the entry files whose collection properties reference the
 * changed items. Only the entries of the items' workspace are rewritten.
 *
 * The changed items' own records are left to whatever changed them,
 * which knows whether anything the record holds actually moved.
 *
 * @param event - The item address changes.
 */
export async function onItemAddressesChanged(
  event: ItemAddressesChangedEventData,
): Promise<void> {
  const { workspaceId, changes, action } = event;

  // Collect the changed item IDs
  const changedIds = changes.map((change) => change.id);

  // Record each change against the entries which reference it, so
  // that their older records can be followed to the new address.
  await Promise.all(
    changes.map((change) =>
      recordEntriesReferenceRename(change, workspaceId, action),
    ),
  );

  // Find entries referencing the changed items
  const referencingEntries = getReferencingEntries(changedIds, workspaceId);

  // Rewrite each referencing entry's file
  await Promise.all(
    referencingEntries.map((entry) => writeEntry(entry.id, { workspaceId })),
  );
}
