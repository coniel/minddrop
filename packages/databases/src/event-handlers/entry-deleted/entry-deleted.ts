import { Collections } from '@minddrop/collections';
import { DataViews } from '@minddrop/data-views';
import { DatabaseEntryDeletedEventData } from '../../events';
import { getDatabase } from '../../getDatabase';
import { removeEntriesFromCollections } from '../../removeEntriesFromCollections';
import { sqlDeleteEntries } from '../../sql';
import { virtualCollectionId } from '../../utils';

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
      if (Collections.get(collectionId, false)) {
        return Collections.delete(collectionId);
      }

      return Promise.resolve();
    }),
  );

  // Remove the entry from collections referencing it as a member
  await removeEntriesFromCollections([data.id]);

  // Remove the entry from view configs referencing it
  await DataViews.removeReferences([data.id]);
}
