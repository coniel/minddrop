import type { DatabaseEntryCreatedEventData } from '@minddrop/databases';
import { Databases } from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { DatabaseEntriesSqlSyncedEvent } from '../events';
import type { DatabaseEntriesSqlSyncedEventData } from '../events';
import { upsertEntries } from '../operations';
import { convertEntryToSqlRecord } from '../utils';

/**
 * Handles entry created events by syncing the new entry
 * to SQL and dispatching a synced event.
 */
export function onCreateEntry(data: DatabaseEntryCreatedEventData): void {
  const database = Databases.get(data.database);

  if (!database) {
    return;
  }

  // Convert the entry to SQL format
  const record = convertEntryToSqlRecord(data, database);

  // Upsert into SQL
  upsertEntries([record]);

  // Dispatch synced event
  Events.dispatch<DatabaseEntriesSqlSyncedEventData>(
    DatabaseEntriesSqlSyncedEvent,
    {
      action: 'upsert',
      entryIds: [record.id],
      databaseId: database.id,
      entries: [record],
    },
  );
}
