import { DatabaseUpdatedEventData } from '../../events';
import { getAllDatabaseEntries } from '../../getAllDatabaseEntries';
import { sqlUpsertDatabase, sqlUpsertEntries } from '../../sql';
import { convertEntryToSqlRecord } from '../../utils';

/**
 * Called when a database is updated. Syncs the updated
 * metadata to SQL, along with the entries' records when the
 * update moved their files.
 */
export function onUpdateDatabase(data: DatabaseUpdatedEventData): void {
  const { original, updated } = data;

  sqlUpsertDatabase({
    id: updated.id,
    name: updated.name,
    path: updated.path,
    icon: updated.icon,
  });

  // The serializer sets the entry files' extension, and entry storage
  // wraps them in per-entry directories, so either changing moves them
  const entriesMoved =
    original.entrySerializer !== updated.entrySerializer ||
    (original.propertyFileStorage === 'entry') !==
      (updated.propertyFileStorage === 'entry');

  // Nothing more to sync when the entry files stayed put
  if (!entriesMoved) {
    return;
  }

  // Refresh the entries' records so SQL holds their new paths
  const records = getAllDatabaseEntries(updated.id).map((entry) =>
    convertEntryToSqlRecord(entry, updated),
  );

  if (records.length > 0) {
    sqlUpsertEntries(updated.id, records);
  }
}
