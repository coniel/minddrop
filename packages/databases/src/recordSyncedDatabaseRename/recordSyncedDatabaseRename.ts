import { History } from '@minddrop/history';
import { DatabaseHistoryCauses } from '../constants';
import { readDeletedDatabaseName } from '../readDeletedDatabaseName';
import { recordDatabaseRename } from '../recordDatabaseRename';
import { Database } from '../types';

/**
 * Records the rename a background sync found for a database, if it
 * found one.
 *
 * @param database - The synced database.
 * @param storedName - The database's name in the store before the sync, or null when the store did not hold it.
 * @param workspacePath - The path of the synced workspace.
 */
export async function recordSyncedDatabaseRename(
  database: Database,
  storedName: string | null,
  workspacePath: string,
): Promise<void> {
  // Resolve the name the database had before the sync
  const previousName =
    storedName ?? (await readDeletedDatabaseName(database.id, workspacePath));

  // Check the database had a name before the sync and that it
  // changed. If not, there is no rename to record.
  if (!previousName || previousName === database.name) {
    return;
  }

  // Record the rename under an action of its own
  await recordDatabaseRename(
    database,
    previousName,
    History.createAction(DatabaseHistoryCauses.DatabaseRenamed),
    workspacePath,
  );
}
