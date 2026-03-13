import { Events } from '@minddrop/events';
import { Sql } from '@minddrop/sql';
import { DatabaseEntriesSqlSyncedEvent } from '../events';
import type { DatabaseEntriesSqlSyncedEventData } from '../events';

/**
 * Deletes one or more entries from the SQL database.
 * CASCADE takes care of cleaning up related property rows.
 * Dispatches a DatabaseEntriesSqlSyncedEvent.
 */
export function sqlDeleteEntries(
  databaseId: string,
  entryIds: string[],
  options?: { silent?: boolean },
): void {
  Sql.transaction([
    ...entryIds.map((id) => ({
      sql: 'DELETE FROM entries WHERE id = ?',
      params: [id],
    })),
    {
      sql: "UPDATE meta SET value = CAST(CAST(value AS INTEGER) + 1 AS TEXT) WHERE key = 'version'",
      params: [],
    },
  ]);

  // Dispatch SQL synced event unless silenced
  if (!options?.silent) {
    Events.dispatch<DatabaseEntriesSqlSyncedEventData>(
      DatabaseEntriesSqlSyncedEvent,
      {
        action: 'delete',
        entryIds,
        databaseId,
      },
    );
  }
}
