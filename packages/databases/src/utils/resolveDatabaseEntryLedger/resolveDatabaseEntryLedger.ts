import { Ledger } from '@minddrop/history';
import { EntryLedgerType } from '../../constants';
import { Database } from '../../types';
import { resolveDatabasePath } from '../resolveDatabasePath';

/**
 * Resolves the ledger of a database's entries.
 *
 * @param database - The database to resolve the entries ledger of.
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The database's entries ledger.
 */
export function resolveDatabaseEntryLedger(
  database: Database,
  workspacePath?: string,
): Ledger {
  return {
    // The database's directory
    ownerPath: resolveDatabasePath(database, workspacePath),
    // The entries ledger type
    type: EntryLedgerType,
  };
}
