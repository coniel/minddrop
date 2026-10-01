import { Ledger } from '@minddrop/history';
import { Workspaces } from '@minddrop/workspaces';
import { DatabaseLedgerType } from '../../constants';

/**
 * Resolves the ledger of a workspace's databases.
 *
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The workspace's databases ledger.
 */
export function resolveWorkspaceDatabaseLedger(workspacePath?: string): Ledger {
  return {
    // The workspace's directory
    ownerPath: workspacePath ?? Workspaces.getActive().path,
    // The databases ledger type
    type: DatabaseLedgerType,
  };
}
