import { LedgerRecord, LedgerRecordInput, Ledgers } from '@minddrop/history';
import { Database } from '../types';
import { resolveDatabaseEntryLedger } from '../utils';

/**
 * Records a change in the ledger of a database's entries.
 *
 * @param database - The database whose entries ledger to record in.
 * @param record - The change to record.
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The recorded change.
 */
export async function recordDatabaseEntryLedger(
  database: Database,
  record: LedgerRecordInput,
  workspacePath?: string,
): Promise<LedgerRecord> {
  // Record the change in the database's entries ledger
  return Ledgers.record(
    resolveDatabaseEntryLedger(database, workspacePath),
    record,
  );
}
