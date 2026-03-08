import { Collections } from '@minddrop/collections';
import { getDatabase } from '../../getDatabase';
import { DatabaseEntry } from '../../types';
import { virtualCollectionId } from '../../utils';

/**
 * Called when a database entry is deleted. Deletes the virtual
 * collections associated with the entry's collection properties.
 */
export async function onDeleteEntry(entry: DatabaseEntry) {
  // Get the database to access its properties schema
  const database = getDatabase(entry.database);

  // Find all collection properties in the schema
  const collectionProperties = database.properties.filter(
    (property) => property.type === 'collection',
  );

  // Nothing to do if there are no collection properties
  if (collectionProperties.length === 0) {
    return;
  }

  // Delete the virtual collection for each collection property
  await Promise.all(
    collectionProperties.map((property) => {
      const collectionId = virtualCollectionId(entry.id, property.name);

      // Only delete if the collection exists in the store
      if (Collections.Store.get(collectionId)) {
        return Collections.delete(collectionId);
      }

      return Promise.resolve();
    }),
  );
}
