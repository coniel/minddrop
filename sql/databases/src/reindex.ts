import type { Database } from '@minddrop/databases';
import { DatabaseEntries } from '@minddrop/databases';
import { upsertEntries } from './operations';
import { convertEntryToSqlRecord } from './utils';

/**
 * Re-indexes all entries for a database by reading them from
 * the entries store, converting to SQL records, and upserting
 * into the SQL database. Used when the property schema changes
 * (add/remove).
 */
export function reindexDatabaseEntries(database: Database): void {
  // Get all entries for this database from the store
  const entries = DatabaseEntries.getAll(database.id);

  if (entries.length === 0) {
    return;
  }

  // Convert to SQL records and upsert
  const records = entries.map((entry) =>
    convertEntryToSqlRecord(entry, database),
  );

  upsertEntries(records);
}
