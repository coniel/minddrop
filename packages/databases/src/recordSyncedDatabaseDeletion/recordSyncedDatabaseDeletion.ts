import { History } from '@minddrop/history';
import { DatabaseHistoryCauses } from '../constants';
import { recordWorkspaceDatabaseLedger } from '../recordWorkspaceDatabaseLedger';
import { Database } from '../types';

/**
 * Records the deletion a background sync found for a database in the
 * workspace's databases ledger. The database's own history is not
 * written, since its directory is gone.
 *
 * @param database - The deleted database, as the store held it.
 * @param workspacePath - The path of the synced workspace.
 */
export async function recordSyncedDatabaseDeletion(
  database: Database,
  workspacePath: string,
): Promise<void> {
  // Record the deletion under an action of its own
  await recordWorkspaceDatabaseLedger(
    {
      kind: 'deleted',
      subject: { key: database.name, id: database.id },
      action: History.createAction(DatabaseHistoryCauses.DatabaseDeleted),
    },
    workspacePath,
  );
}
