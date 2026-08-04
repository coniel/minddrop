import { Collections } from '@minddrop/collections';
import { Events } from '@minddrop/events';
import {
  ItemAddressesChangedEvent,
  ItemAddressesChangedEventData,
} from '@minddrop/item-references';
import { DatabaseEntryRenamedEventData } from '../../events';
import { getDatabase } from '../../getDatabase';
import { flushDatabaseMetadata } from '../../updateEntryMetadata';
import { rekeyPendingMetadata } from '../../updateEntryMetadata/updateEntryMetadata';
import {
  databaseEntryAddress,
  entryMetadataKey,
  rekeyDatabaseMetadata,
  virtualCollectionId,
  virtualCollectionName,
} from '../../utils';

/**
 * Called when a database entry is renamed. Updates path-derived
 * state: metadata keys, the SQL record, and virtual collection
 * names.
 */
export async function onRenameEntry(data: DatabaseEntryRenamedEventData) {
  const { original, updated } = data;

  // Get the database to access its properties schema
  const database = getDatabase(updated.database);

  // Step 1: Flush any pending metadata writes so nothing is lost
  await flushDatabaseMetadata(database.path);

  // Metadata is keyed by the database-relative entry path
  const oldMetadataKey = entryMetadataKey(original.path, database.path);
  const newMetadataKey = entryMetadataKey(updated.path, database.path);

  // Step 2: Re-key the on-disk metadata file from the old to the new path
  await rekeyDatabaseMetadata(database.path, oldMetadataKey, newMetadataKey);

  // Step 3: Re-key any in-flight pending metadata entries
  rekeyPendingMetadata(database.path, oldMetadataKey, newMetadataKey);

  // Find all collection properties in the schema
  const collectionProperties = database.properties.filter(
    (property) => property.type === 'collection',
  );

  // Update virtual collection names, which embed the entry title
  await Promise.all(
    collectionProperties.map(async (property) => {
      const collectionId = virtualCollectionId(updated.id, property.name);

      // Skip if the virtual collection does not exist
      if (!Collections.Store.get(collectionId)) {
        return;
      }

      // Derive the collection name from the new entry title
      const name = virtualCollectionName(
        database.name,
        updated.title,
        property.name,
      );

      // Update the collection's name
      await Collections.update(collectionId, { name });
    }),
  );

  // Dispatch the entry's address change
  await Events.dispatch<ItemAddressesChangedEventData>(
    ItemAddressesChangedEvent,
    [
      {
        id: updated.id,
        oldReference: databaseEntryAddress(original.path),
        newReference: databaseEntryAddress(updated.path),
      },
    ],
  );
}
