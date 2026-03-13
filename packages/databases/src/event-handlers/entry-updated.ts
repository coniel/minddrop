import { DatabaseEntryUpdatedEventData } from '../events';
import { getDatabase } from '../getDatabase';
import { sqlUpsertEntries } from '../sql';
import { convertEntryToSqlRecord } from '../utils';

/**
 * Called when a database entry is updated. Syncs the updated
 * entry to SQL.
 */
export function onUpdateEntry(data: DatabaseEntryUpdatedEventData): void {
  const database = getDatabase(data.updated.database);

  // Convert the updated entry to SQL format
  const record = convertEntryToSqlRecord(data.updated, database);

  // Upsert into SQL
  sqlUpsertEntries(database.id, [record]);
}
