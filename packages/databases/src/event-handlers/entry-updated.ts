import { Events } from '@minddrop/events';
import {
  DatabaseEntriesSqlSyncedEvent,
  DatabaseEntryUpdatedEventData,
} from '../events';
import type { DatabaseEntriesSqlSyncedEventData } from '../events';
import { getDatabase } from '../getDatabase';
import { upsertEntries } from '../sql';
import { convertEntryToSqlRecord } from '../utils';

/**
 * Called when a database entry is updated. Syncs the updated
 * entry to SQL and dispatches a synced event.
 */
export function onUpdateEntry(data: DatabaseEntryUpdatedEventData): void {
  const database = getDatabase(data.updated.database);

  // Convert the updated entry to SQL format
  const record = convertEntryToSqlRecord(data.updated, database);

  // Upsert into SQL
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
}
