import { Collections } from '@minddrop/collections';
import { Events } from '@minddrop/events';
import { ItemReferences } from '@minddrop/item-references';
import { Workspaces } from '@minddrop/workspaces';
import { DatabaseRenamedEventData } from '../../events';
import { getAllEntries } from '../../getAllEntries';
import { recordDatabaseRename } from '../../recordDatabaseRename';
import { sqlUpsertDatabase } from '../../sql';
import {
  entryAddress,
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

  // Record the rename. The database's history has already moved with
  // its directory.
  await recordDatabaseRename(updated, original.name, action);

  // Read the database's entries, whose addresses the rename changes
  const entries = getAllEntries(updated.id);

  // Update the SQL record with the new name and path
  sqlUpsertDatabase({
    id: updated.id,
    name: updated.name,
    path: updated.path,
    icon: updated.icon,
    properties: updated.properties,
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
        oldReference: entryAddress(entry, original),
        newReference: entryAddress(entry, updated),
      })),
      action,
    });
  }
}
