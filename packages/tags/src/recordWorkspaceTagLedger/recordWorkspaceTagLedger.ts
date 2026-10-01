import { LedgerRecord, LedgerRecordInput, Ledgers } from '@minddrop/history';
import { resolveWorkspaceTagLedger } from '../utils';

/**
 * Records a change in the ledger of a workspace's tags.
 *
 * @param record - The change to record.
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The recorded change.
 */
export async function recordWorkspaceTagLedger(
  record: LedgerRecordInput,
  workspacePath?: string,
): Promise<LedgerRecord> {
  // Record the change in the workspace's tags ledger
  return Ledgers.record(resolveWorkspaceTagLedger(workspacePath), record);
}
