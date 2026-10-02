import { HistoryAction } from '@minddrop/history';
import { recordDatabaseHistory } from '../recordDatabaseHistory';
import { recordWorkspaceDatabaseLedger } from '../recordWorkspaceDatabaseLedger';
import { Database } from '../types';

/**
 * Records a database's rename.
 *
 * @param database - The renamed database.
 * @param previousName - The database's name before the rename.
 * @param action - The action performing the rename.
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 */
export async function recordDatabaseRename(
  database: Database,
  previousName: string,
  action: HistoryAction,
  workspacePath?: string,
): Promise<void> {
  // Record the rename against the database's history
  await recordDatabaseHistory(
    database,
    {
      kind: 'rename',
      target: 'self',
      from: previousName,
      to: database.name,
      action,
    },
    workspacePath,
  );

  // Record the rename in the workspace's databases ledger under the
  // previous name, after the database's own history has it.
  await recordWorkspaceDatabaseLedger(
    {
      kind: 'rename',
      subject: { key: previousName, id: database.id },
      to: database.name,
      action,
    },
    workspacePath,
  );
}
