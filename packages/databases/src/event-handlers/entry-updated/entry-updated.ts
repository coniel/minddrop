import { History } from '@minddrop/history';
import { DatabaseEntryUpdatedEventData } from '../../events';
import { getDatabase } from '../../getDatabase';
import { sqlUpsertEntries } from '../../sql';
import {
  convertEntryToSqlRecord,
  resolveDatabasePath,
  resolvePropertyChanges,
} from '../../utils';

/**
 * Called when a database entry is updated. Syncs the updated
 * entry to SQL and records the properties the update changed.
 */
export async function onUpdateEntry(
  data: DatabaseEntryUpdatedEventData,
): Promise<void> {
  const { original, updated } = data;
  const database = getDatabase(updated.database);

  // Convert the updated entry to SQL format
  const record = convertEntryToSqlRecord(updated, database);

  // Upsert into SQL
  sqlUpsertEntries(database.id, [record]);

  // Work out which properties the update changed
  const changes = resolvePropertyChanges(
    database.properties,
    original.properties,
    updated.properties,
  );

  // Check the update changed a property worth recording
  if (!changes.length) {
    return;
  }

  // Record the properties changed by this update as one change
  await History.record({
    ownerPath: resolveDatabasePath(database),
    subjectKey: updated.title,
    kind: 'property',
    changes,
  });
}
