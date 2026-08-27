import { Collections } from '@minddrop/collections';
import { Events } from '@minddrop/events';
import { ItemAddressesChangedEvent } from '@minddrop/item-references';
import { DatabaseEntryRenamedEventData } from '../../events';
import { getDatabase } from '../../getDatabase';
import { moveEntryMetadataFile } from '../../moveEntryMetadataFile';
import {
  databaseEntryAddress,
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

  // Move the sidecar to follow the entry to its new path
  await moveEntryMetadataFile(database.path, original.path, updated.path);

  // Find all collection properties in the schema
  const collectionProperties = database.properties.filter(
    (property) => property.type === 'collection',
  );

  // Update virtual collection names, which embed the entry title
  await Promise.all(
    collectionProperties.map(async (property) => {
      const collectionId = virtualCollectionId(updated.id, property.name);

      // Skip if the virtual collection does not exist
      if (!Collections.get(collectionId, false)) {
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
  await Events.dispatch(ItemAddressesChangedEvent, [
    {
      id: updated.id,
      oldReference: databaseEntryAddress(original.path),
      newReference: databaseEntryAddress(updated.path),
    },
  ]);
}
