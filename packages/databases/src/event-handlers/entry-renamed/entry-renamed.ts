import { Collections } from '@minddrop/collections';
import { DatabaseEntryRenamedEventData } from '../../events';
import { getDatabase } from '../../getDatabase';
import { virtualCollectionId, virtualCollectionName } from '../../utils';

/**
 * Called when a database entry is renamed. Updates the names of
 * virtual collections associated with the entry's collection
 * properties to reflect the new entry title.
 */
export async function onRenameEntry(data: DatabaseEntryRenamedEventData) {
  const { updated } = data;

  // Get the database to access its properties schema
  const database = getDatabase(updated.database);

  // Find all collection properties in the schema
  const collectionProperties = database.properties.filter(
    (property) => property.type === 'collection',
  );

  // Nothing to do if there are no collection properties
  if (collectionProperties.length === 0) {
    return;
  }

  // Update the name of each virtual collection
  await Promise.all(
    collectionProperties.map(async (property) => {
      const collectionId = virtualCollectionId(updated.id, property.name);

      // Only update if the collection exists in the store
      if (!Collections.Store.get(collectionId)) {
        return;
      }

      // Update the collection name to reflect the new entry title
      const name = virtualCollectionName(
        database.name,
        updated.title,
        property.name,
      );

      await Collections.update(collectionId, { name });
    }),
  );
}
