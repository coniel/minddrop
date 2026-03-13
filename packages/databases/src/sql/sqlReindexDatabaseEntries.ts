import { Events } from '@minddrop/events';
import { DatabaseSqlReindexedEvent } from '../events';
import type { DatabaseSqlReindexedEventData } from '../events';
import { getAllDatabaseEntries } from '../getAllDatabaseEntries';
import type { Database } from '../types';
import { convertEntryToSqlRecord } from '../utils';
import { sqlUpsertEntries } from './sqlUpsertEntries';

/**
 * Re-indexes all entries for a database by reading them from
 * the entries store, converting to SQL records, and upserting
 * into the SQL database. Used when the property schema changes
 * (add/remove). Dispatches a DatabaseSqlReindexedEvent.
 */
export function sqlReindexDatabaseEntries(database: Database): void {
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

  sqlUpsertEntries(database.id, records, { silent: true });

  // Dispatch reindexed event
  Events.dispatch<DatabaseSqlReindexedEventData>(DatabaseSqlReindexedEvent, {
    databaseId: database.id,
  });
}
