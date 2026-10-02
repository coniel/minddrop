import { Ledgers } from '@minddrop/history';
import { resolveWorkspaceDatabaseLedger } from '../utils';

/**
 * Reads the name a database was deleted under from the workspace's
 * databases ledger.
 *
 * @param databaseId - The ID of the database.
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The name on the database's last ledger record, or null when that record is not a deletion.
 */
export async function readDeletedDatabaseName(
  databaseId: string,
  workspacePath?: string,
): Promise<string | null> {
  // Read the workspace's databases ledger
  const records = await Ledgers.read(
    resolveWorkspaceDatabaseLedger(workspacePath),
  );

  // Find the database's latest record
  const record = [...records]
    .reverse()
    .find((record) => record.subject.id === databaseId);

  // Check the database's latest record is a deletion. If not, there
  // is no deleted name to read.
  if (!record || record.kind !== 'deleted') {
    return null;
  }

  return record.subject.key;
}
