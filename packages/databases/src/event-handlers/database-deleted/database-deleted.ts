import { Collections } from '@minddrop/collections';
import { Events } from '@minddrop/events';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { DatabaseDeletedEventData, DatabaseSqlSyncedEvent } from '../../events';
import type { DatabaseSqlSyncedEventData } from '../../events';
import { deleteDatabase } from '../../sql';
import { virtualCollectionId } from '../../utils';

/**
 * Called when a database is deleted. Removes from SQL and
 * deletes virtual collections for collection properties.
 */
export async function onDeleteDatabase(
  data: DatabaseDeletedEventData,
): Promise<void> {
  // Delete from SQL
  deleteDatabase(data.id);

  // Dispatch SQL synced event
  Events.dispatch<DatabaseSqlSyncedEventData>(DatabaseSqlSyncedEvent, {
    action: 'delete',
    databaseId: data.id,
  });

  // Find collection properties in the database schema
  const collectionProperties = data.properties.filter(
    (property) => property.type === 'collection',
  );

  // Nothing to do if there are no collection properties
  if (collectionProperties.length === 0) {
    return;
  }

  // Get entries belonging to this database
  const entries = DatabaseEntriesStore.getAllArray().filter(
    (entry) => entry.database === data.id,
  );

  // Delete all virtual collections for each entry's collection properties
  await Promise.all(
    collectionProperties.flatMap((property) =>
      entries.map((entry) => {
        const collectionId = virtualCollectionId(entry.id, property.name);

        // Only delete if the collection exists in the store
        if (Collections.Store.get(collectionId)) {
          return Collections.delete(collectionId);
        }

        return Promise.resolve();
      }),
    ),
  );
}
