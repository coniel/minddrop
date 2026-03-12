import { Collections } from '@minddrop/collections';
import { Events } from '@minddrop/events';
import {
  DatabaseEntriesSqlSyncedEvent,
  DatabaseEntryRenamedEventData,
} from '../../events';
import type { DatabaseEntriesSqlSyncedEventData } from '../../events';
import { getDatabase } from '../../getDatabase';
import { upsertEntries } from '../../sql';
import {
  convertEntryToSqlRecord,
  virtualCollectionId,
  virtualCollectionName,
} from '../../utils';

/**
 * Called when a database entry is renamed. Syncs to SQL and
 * updates virtual collection names.
 */
export async function onRenameEntry(data: DatabaseEntryRenamedEventData) {
  const { updated } = data;

  // Get the database to access its properties schema
  const database = getDatabase(updated.database);

  // Sync renamed entry to SQL
  const record = convertEntryToSqlRecord(updated, database);
  upsertEntries([record]);

  // Dispatch SQL synced event
  Events.dispatch<DatabaseEntriesSqlSyncedEventData>(
    DatabaseEntriesSqlSyncedEvent,
    {
      action: 'upsert',
      entryIds: [record.id],
      databaseId: database.id,
      entries: [record],
    },
  );

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
