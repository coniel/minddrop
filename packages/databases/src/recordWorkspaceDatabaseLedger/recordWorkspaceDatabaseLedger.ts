import { LedgerRecord, LedgerRecordInput, Ledgers } from '@minddrop/history';
import { resolveWorkspaceDatabaseLedger } from '../utils';

/**
 * Records a change in the ledger of a workspace's databases.
 *
 * @param record - The change to record.
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The recorded change.
 */
export async function recordWorkspaceDatabaseLedger(
  record: LedgerRecordInput,
  workspacePath?: string,
): Promise<LedgerRecord> {
  // Record the change in the workspace's databases ledger
  return Ledgers.record(resolveWorkspaceDatabaseLedger(workspacePath), record);
}
