import type { DatabaseEntryRenamedEventData } from '@minddrop/databases';
import { Databases } from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { DatabaseEntriesSqlSyncedEvent } from '../events';
import type { DatabaseEntriesSqlSyncedEventData } from '../events';
import { upsertEntries } from '../operations';
import { convertEntryToSqlRecord } from '../utils';

/**
 * Handles entry renamed events by syncing the renamed entry
 * to SQL and dispatching a synced event.
 */
export function onRenameEntry(data: DatabaseEntryRenamedEventData): void {
  const database = Databases.get(data.updated.database);

  if (!database) {
    return;
  }

  // Convert the renamed entry to SQL format
  const record = convertEntryToSqlRecord(data.updated, database);

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
