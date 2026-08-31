import { Collections } from '@minddrop/collections';
import { Events } from '@minddrop/events';
import { ItemAddressesChangedEvent } from '@minddrop/item-references';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { DatabaseRenamedEventData } from '../../events';
import { getAllDatabaseEntries } from '../../getAllDatabaseEntries';
import { sqlUpsertDatabase } from '../../sql';
import {
  databaseEntryAddress,
  virtualCollectionId,
  virtualCollectionName,
} from '../../utils';

/**
 * Called when a database is renamed. Updates path-derived state:
 * entry paths, SQL records, and virtual collection names.
 *
 * The on-disk metadata file needs no changes: its keys are database-
 * relative (see `entryMetadataKey`), so they are unaffected by the
 * database path change.
 */
export async function onRenameDatabase(
  data: DatabaseRenamedEventData,
): Promise<void> {
  const { original, updated } = data;

  // Read the database's entries
  const entries = getAllDatabaseEntries(updated.id);

  // Build the updated entries, swapping the database path prefix
  const renamedEntries = entries.map((entry) => ({
    ...entry,
    path: `${updated.path}${entry.path.slice(original.path.length)}`,
  }));

  // Update each entry in place in the store
  renamedEntries.forEach((entry) => {
    DatabaseEntriesStore.update(entry.id, { path: entry.path });
  });

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
    renamedEntries.map((entry) =>
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
  if (renamedEntries.length > 0) {
    await Events.dispatch(
      ItemAddressesChangedEvent,
      renamedEntries.map((entry) => ({
        id: entry.id,
        oldReference: databaseEntryAddress(entry, original),
        newReference: databaseEntryAddress(entry, updated),
      })),
    );
  }
}
