import { appendLogRecord } from '../appendLogRecord';
import { Ledger, LedgerRecord, LedgerRecordInput } from '../types';
import { resolveLedgerDirPath } from '../utils';

/**
 * Records a change in a ledger, stamping it with the current time and
 * appending it to the ledger's log.
 *
 * @param ledger - The ledger to record the change in.
 * @param record - The change to record.
 * @returns The recorded change.
 */
export async function recordLedger(
  ledger: Ledger,
  record: LedgerRecordInput,
): Promise<LedgerRecord> {
  const ledgerDirPath = resolveLedgerDirPath(ledger);

  // Append the record to the ledger's log, stamped with the current
  // time.
  return appendLogRecord(ledgerDirPath, async () => ({
    timestamp: new Date(),
    ...record,
  }));
}
