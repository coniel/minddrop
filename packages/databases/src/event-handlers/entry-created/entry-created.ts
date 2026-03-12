import { Collections } from '@minddrop/collections';
import { Events } from '@minddrop/events';
import {
  DatabaseEntriesSqlSyncedEvent,
  DatabaseEntryCreatedEventData,
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
 * Called when a database entry is created. Syncs to SQL and
 * creates virtual collections for collection properties.
 */
export function onCreateEntry(data: DatabaseEntryCreatedEventData) {
  // Get the database to access its properties schema
  const database = getDatabase(data.database);

  // Sync to SQL
  const record = convertEntryToSqlRecord(data, database);
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

  // Create a virtual collection for each collection property
  collectionProperties.forEach((property) => {
    // Deterministic ID based on entry and property
    const collectionId = virtualCollectionId(data.id, property.name);

    // Collection name: [database] - [entry] - [property]
    const name = virtualCollectionName(
      database.name,
      data.title,
      property.name,
    );

    // Get the entry IDs from the property value
    const entries = (data.properties[property.name] as string[]) || [];

    // Create the virtual collection in the store
    Collections.createVirtual(collectionId, name, entries);
  });
}
