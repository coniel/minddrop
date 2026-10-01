import { Collections } from '@minddrop/collections';
import { Events } from '@minddrop/events';
import { ItemReferences } from '@minddrop/item-references';
import { Workspaces } from '@minddrop/workspaces';
import { DatabaseRenamedEventData } from '../../events';
import { getAllDatabaseEntries } from '../../getAllDatabaseEntries';
import { recordDatabaseHistory } from '../../recordDatabaseHistory';
import { recordWorkspaceDatabaseLedger } from '../../recordWorkspaceDatabaseLedger';
import { sqlUpsertDatabase } from '../../sql';
import {
  databaseEntryAddress,
  virtualCollectionId,
  virtualCollectionName,
} from '../../utils';

/**
 * Called when a database is renamed. Updates the state derived from
 * its name.
 *
 * Neither the entries nor their metadata files need changes: entry
 * paths are addressed from their database and metadata keys from the
 * entry file name, so neither moves with the database.
 *
 * @param data - The renamed database's data.
 */
export async function onRenameDatabase(
  data: DatabaseRenamedEventData,
): Promise<void> {
  const { original, updated, action } = data;

  // Record the rename against the database's history. The history
  // has already moved with the database's directory.
  await recordDatabaseHistory(updated, {
    kind: 'rename',
    target: 'self',
    from: original.name,
    to: updated.name,
    action,
  });

  // Record the rename in the workspace's databases ledger under the
  // old name, after the database's own history has it.
  await recordWorkspaceDatabaseLedger({
    kind: 'rename',
    subject: { key: original.name, id: original.id },
    to: updated.name,
    action,
  });

  // Read the database's entries, whose addresses the rename changes
  const entries = getAllDatabaseEntries(updated.id);

  // Update the SQL record with the new name and path
  sqlUpsertDatabase({
    id: updated.id,
    name: updated.name,
    path: updated.path,
    icon: updated.icon,
  });

  // Find collection properties in the database schema
  const collectionProperties = updated.properties.filter(
    (property) => property.type === 'collection',
  );

  // Update virtual collection names, which embed the database name
  await Promise.all(
    entries.map((entry) =>
      Promise.all(
        collectionProperties.map(async (property) => {
          const collectionId = virtualCollectionId(entry.id, property.name);

          // Skip if the virtual collection does not exist
          if (!Collections.get(collectionId, false)) {
            return;
          }

          // Derive the collection name from the new database name
          const name = virtualCollectionName(
            updated.name,
            entry.title,
            property.name,
          );

          // Update the collection's name
          await Collections.update(collectionId, { name });
        }),
      ),
    ),
  );

  // Dispatch the renamed entries' address changes
  if (entries.length > 0) {
    Events.dispatch(ItemReferences.events.AddressesChanged, {
      workspaceId: Workspaces.getActive().id,
      changes: entries.map((entry) => ({
        id: entry.id,
        oldReference: databaseEntryAddress(entry, original),
        newReference: databaseEntryAddress(entry, updated),
      })),
      action,
    });
  }
}
