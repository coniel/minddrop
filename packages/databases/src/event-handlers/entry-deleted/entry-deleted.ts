import { Collections } from '@minddrop/collections';
import { DatabaseEntryDeletedEventData } from '../../events';
import { getDatabase } from '../../getDatabase';
import { sqlDeleteEntries } from '../../sql';
import { removeEntriesFromCollections, virtualCollectionId } from '../../utils';

/**
 * Called when a database entry is deleted. Removes from SQL,
 * deletes virtual collections for collection properties, and
 * removes the entry from collections referencing it.
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

  // Delete the entry's own virtual collections before membership
  // cleanup so no update is attempted for the deleted entry
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

  // Remove the entry from collections referencing it as a member
  await removeEntriesFromCollections([data.id]);
}
