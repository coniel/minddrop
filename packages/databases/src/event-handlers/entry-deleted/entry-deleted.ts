import { Collections } from '@minddrop/collections';
import { Events } from '@minddrop/events';
import {
  DatabaseEntriesSqlSyncedEvent,
  DatabaseEntryDeletedEventData,
} from '../../events';
import type { DatabaseEntriesSqlSyncedEventData } from '../../events';
import { getDatabase } from '../../getDatabase';
import { deleteEntries } from '../../sql';
import { virtualCollectionId } from '../../utils';

/**
 * Called when a database entry is deleted. Removes from SQL
 * and deletes virtual collections for collection properties.
 */
export async function onDeleteEntry(data: DatabaseEntryDeletedEventData) {
  // Delete from SQL (CASCADE handles property cleanup)
  deleteEntries([data.id]);

  // Dispatch SQL synced event
  Events.dispatch<DatabaseEntriesSqlSyncedEventData>(
    DatabaseEntriesSqlSyncedEvent,
    {
      action: 'delete',
      entryIds: [data.id],
      databaseId: data.database,
    },
  );

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
