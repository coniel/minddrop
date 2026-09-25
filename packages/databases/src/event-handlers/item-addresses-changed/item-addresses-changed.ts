import { ContentViews } from '@minddrop/content-views';
import { ItemAddressesChangedEventData } from '@minddrop/item-references';
import { isEntityId } from '@minddrop/utils';
import { persistVirtualViewConfig } from '../../persistVirtualViewConfig';
import { recordDatabaseEntriesReferenceRename } from '../../recordDatabaseEntriesReferenceRename';
import { getReferencingEntries } from '../../utils';
import { writeDatabaseEntry } from '../../writeDatabaseEntry';

/**
 * Rewrites entry files whose collection properties reference changed
 * items and re-persists embedded view configs referencing them, in
 * the workspace the items belong to, so durable references stay
 * current.
 *
 * The changed items' own records are left to whatever changed them,
 * which knows whether anything the record holds actually moved.
 *
 * @param event - The item address changes.
 */
export async function onItemAddressesChanged(
  event: ItemAddressesChangedEventData,
): Promise<void> {
  const { workspaceId, changes } = event;

  // Collect the changed item IDs
  const changedIds = changes.map((change) => change.id);

  // Record each change against the entries which reference it, so
  // that their older records can be followed to the new address.
  await Promise.all(
    changes.map((change) =>
      recordDatabaseEntriesReferenceRename(change, workspaceId),
    ),
  );

  // Find entries referencing the changed items
  const referencingEntries = getReferencingEntries(changedIds, workspaceId);

  // Rewrite each referencing entry's file
  await Promise.all(
    referencingEntries.map((entry) =>
      writeDatabaseEntry(entry.id, { workspaceId }),
    ),
  );

  // Re-persist embedded view configs referencing the changed items
  await Promise.all(
    ContentViews.getReferencing(changedIds, workspaceId)
      .filter((view) => view.owner && isEntityId(view.owner, 'database-entry'))
      .map((view) => persistVirtualViewConfig(view, workspaceId)),
  );
}
