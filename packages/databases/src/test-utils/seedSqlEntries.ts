import { sqlUpsertEntries } from '../sql/sqlUpsertEntries';
import { SqlEntryRecord } from '../types';
import { databases, entrySqlRecords } from './fixtures';

/**
 * Indexes every fixture entry's SQL record after passing it through a
 * transform, if one is given.
 *
 * @param transform - Returns the record to index in place of a fixture
 *   record.
 * @param workspaceId - The workspace to index them into. Omit for the
 *   active workspace.
 */
export function seedSqlEntries(
  transform?: (record: SqlEntryRecord) => SqlEntryRecord,
  workspaceId?: string,
): void {
  // Index each database's entry records
  databases.forEach((database) => {
    // Collect the database's transformed entry records
    const records = entrySqlRecords
      .filter((record) => record.databaseId === database.id)
      .map((record) => (transform ? transform(record) : record));

    // Upsert the records, if the database has any
    if (records.length > 0) {
      sqlUpsertEntries(database.id, records, { silent: true }, workspaceId);
    }
  });
}
