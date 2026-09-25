import { ItemAddressChange } from '@minddrop/item-references';
import { Workspaces } from '@minddrop/workspaces';
import { DatabasesStore } from '../DatabasesStore';
import { recordDatabaseEntryHistory } from '../recordDatabaseEntryHistory';
import { getReferencingEntries } from '../utils';

/**
 * Records a single address change against every entry holding a
 * reference to it.
 *
 * @param change - The address change to record.
 * @param workspaceId - The ID of the workspace holding the entries.
 */
export async function recordDatabaseEntriesReferenceRename(
  change: ItemAddressChange,
  workspaceId: string,
): Promise<void> {
  // Resolve the workspace's path
  const workspacePath = Workspaces.resolvePath(workspaceId);
  // Get the workspace's databases store
  const databasesStore = DatabasesStore.in(workspaceId);

  // Find the entries referencing this item alone, since a rename is
  // only recorded against entries which hold it.
  const entries = getReferencingEntries([change.id], workspaceId);

  // Record the rename against each entry
  await Promise.all(
    entries.map(async (entry) => {
      // Get the entry's database
      const database = databasesStore.get(entry.database);

      // Check the entry's database still exists. If not, skip the entry.
      if (!database) {
        return;
      }

      // Record the rename against the entry
      await recordDatabaseEntryHistory(
        database,
        entry,
        {
          kind: 'rename',
          target: 'reference',
          from: change.oldReference,
          to: change.newReference,
        },
        workspacePath,
      );
    }),
  );
}
