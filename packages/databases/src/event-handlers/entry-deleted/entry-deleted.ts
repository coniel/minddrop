import { Collections } from '@minddrop/collections';
import { DatabaseEntryDeletedEventData } from '../../events';
import { getDatabase } from '../../getDatabase';
import { sqlDeleteEntries } from '../../sql';
import { virtualCollectionId } from '../../utils';

/**
 * Called when a database entry is deleted. Removes from SQL
 * and deletes virtual collections for collection properties.
 */
export async function onDeleteEntry(data: DatabaseEntryDeletedEventData) {
  // Delete from SQL
  sqlDeleteEntries(data.database, [data.id]);

  // Get the database to access its properties schema
  const database = getDatabase(data.database);

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
      const collectionId = virtualCollectionId(data.id, property.name);

      // Only delete if the collection exists in the store
      if (Collections.Store.get(collectionId)) {
        return Collections.delete(collectionId);
      }

      return Promise.resolve();
    }),
  );
}
