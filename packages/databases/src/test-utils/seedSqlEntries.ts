import { sqlUpsertEntries } from '../sql/sqlUpsertEntries';
import { SqlEntryRecord } from '../types';
import { databases, entrySqlRecords } from './fixtures';

/**
 * Indexes every fixture entry's SQL record, passed through a
 * transform, grouped by database.
 *
 * @param transform - Returns the record to index in place of a fixture record.
 */
export function seedSqlEntries(
  transform: (record: SqlEntryRecord) => SqlEntryRecord,
): void {
  databases.forEach((database) => {
    // Collect the database's transformed entry records
    const records = entrySqlRecords
      .filter((record) => record.databaseId === database.id)
      .map(transform);

    // Skip databases without entries
    if (records.length > 0) {
      sqlUpsertEntries(database.id, records, { silent: true });
    }
  });
}
