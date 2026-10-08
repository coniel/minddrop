import { ContentViews } from '@minddrop/content-views';
import { ItemAddressesChangedEventData } from '@minddrop/item-references';
import { persistVirtualViewConfig } from '../../persistVirtualViewConfig';
import { recordEntriesReferenceRename } from '../../recordEntriesReferenceRename';
import { getReferencingEntries } from '../../utils';
import { writeEntry } from '../../writeEntry';

/**
 * Updates every persisted reference to the changed items in the
 * items' workspace.
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

  // Re-persist the embedded view configs referencing the changed items
  await Promise.all(
    ContentViews.getReferencing(changedIds, workspaceId).map((view) =>
      persistVirtualViewConfig(view, workspaceId),
    ),
  );
}
