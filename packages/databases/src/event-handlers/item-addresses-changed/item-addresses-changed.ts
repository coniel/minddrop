import { DataViews } from '@minddrop/data-views';
import { History } from '@minddrop/history';
import {
  ItemAddressChange,
  ItemAddressesChangedEventData,
} from '@minddrop/item-references';
import { isEntityId } from '@minddrop/utils';
import { Workspaces } from '@minddrop/workspaces';
import { DatabasesStore } from '../../DatabasesStore';
import { persistVirtualViewConfig } from '../../persistVirtualViewConfig';
import { getReferencingEntries, resolveDatabasePath } from '../../utils';
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
    changes.map((change) => recordReferenceRenames(change, workspaceId)),
  );

  // Find entries referencing the changed items
  const referencingEntries = getReferencingEntries(changedIds, workspaceId);

  // Rewrite each referencing entry's file
  await Promise.all(
    referencingEntries.map((entry) =>
      writeDatabaseEntry(entry.id, workspaceId),
    ),
  );

  // Re-persist embedded view configs referencing the changed items
  await Promise.all(
    DataViews.getReferencing(changedIds, workspaceId)
      .filter((view) => view.owner && isEntityId(view.owner, 'database-entry'))
      .map((view) => persistVirtualViewConfig(view, workspaceId)),
  );
}

/**
 * Records a single address change against every entry holding a
 * reference to it.
 */
async function recordReferenceRenames(
  change: ItemAddressChange,
  workspaceId: string,
): Promise<void> {
  const workspacePath = Workspaces.resolvePath(workspaceId);
  const databasesStore = DatabasesStore.in(workspaceId);

  // Find the entries referencing this item alone, since a rename is
  // only recorded against entries which hold it.
  const entries = getReferencingEntries([change.id], workspaceId);

  await Promise.all(
    entries.map(async (entry) => {
      // Skip entries whose database no longer exists
      const database = databasesStore.get(entry.database);

      if (!database) {
        return;
      }

      await History.record({
        ownerPath: resolveDatabasePath(database, workspacePath),
        subjectKey: entry.title,
        kind: 'rename',
        target: 'reference',
        from: change.oldReference,
        to: change.newReference,
      });
    }),
  );
}
