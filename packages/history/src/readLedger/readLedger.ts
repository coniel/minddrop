import { Ledger, LedgerRecord } from '../types';
import { readLogFiles, resolveLedgerDirPath } from '../utils';

/**
 * Reads a ledger.
 *
 * @param ledger - The ledger to read.
 * @returns The ledger's records, oldest first.
 */
export async function readLedger(ledger: Ledger): Promise<LedgerRecord[]> {
  return readLogFiles(resolveLedgerDirPath(ledger));
}
