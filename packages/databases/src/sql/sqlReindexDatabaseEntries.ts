import { Events } from '@minddrop/events';
import { DatabaseSqlReindexedEvent } from '../events';
import { getAllDatabaseEntries } from '../getAllDatabaseEntries';
import type { Database } from '../types';
import { convertEntryToSqlRecord } from '../utils';
import { sqlUpsertEntries } from './sqlUpsertEntries';

/**
 * Re-indexes all entries for a database by reading them from
 * the entries store, converting to SQL records, and upserting
 * into the SQL database. Used when the property schema changes
 * (add/remove). Dispatches a DatabaseSqlReindexedEvent.
 *
 * @param database - The database whose entries to re-index.
 * @param workspaceId - The ID of the workspace whose database to target. Defaults to the active workspace.
 */
export function sqlReindexDatabaseEntries(
  database: Database,
  workspaceId?: string,
): void {
  // Get all entries for this database from the store
  const entries = getAllDatabaseEntries(database.id);

  if (entries.length === 0) {
    return;
  }

  // Convert to SQL records and upsert (silent to suppress
  // per-entry events)
  const records = entries.map((entry) =>
    convertEntryToSqlRecord(entry, database),
  );

  sqlUpsertEntries(database.id, records, { silent: true }, workspaceId);

  // Dispatch reindexed event
  Events.dispatch(DatabaseSqlReindexedEvent, {
    databaseId: database.id,
  });
}
