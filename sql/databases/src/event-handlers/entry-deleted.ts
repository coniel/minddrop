import type { DatabaseEntryDeletedEventData } from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { DatabaseEntriesSqlSyncedEvent } from '../events';
import type { DatabaseEntriesSqlSyncedEventData } from '../events';
import { deleteEntries } from '../operations';

/**
 * Handles entry deleted events by removing the entry from
 * SQL and dispatching a synced event.
 */
export function onDeleteEntry(data: DatabaseEntryDeletedEventData): void {
  // Delete from SQL (CASCADE handles property cleanup)
  deleteEntries([data.id]);

  // Dispatch synced event
  Events.dispatch<DatabaseEntriesSqlSyncedEventData>(
    DatabaseEntriesSqlSyncedEvent,
    {
      action: 'delete',
      entryIds: [data.id],
      databaseId: data.database,
    },
  );
}
