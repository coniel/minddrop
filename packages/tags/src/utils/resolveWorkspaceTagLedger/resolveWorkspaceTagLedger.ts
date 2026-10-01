import { Ledger } from '@minddrop/history';
import { Workspaces } from '@minddrop/workspaces';
import { TagLedgerType } from '../../constants';

/**
 * Resolves the ledger of a workspace's tags.
 *
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The workspace's tags ledger.
 */
export function resolveWorkspaceTagLedger(workspacePath?: string): Ledger {
  return {
    // The workspace's directory
    ownerPath: workspacePath ?? Workspaces.getActive().path,
    // The tags ledger type
    type: TagLedgerType,
  };
}
