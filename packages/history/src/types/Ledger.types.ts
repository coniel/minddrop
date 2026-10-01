import { DistributiveOmit } from '@minddrop/utils';
import { BaseHistoryRecord } from './HistoryRecord.types';

export interface Ledger {
  /**
   * The absolute path of the directory whose ledger it is.
   */
  ownerPath: string;

  /**
   * The type of subject the ledger records, which it is filed under.
   */
  type: string;
}

export interface LedgerSubject {
  /**
   * The subject's key when the record was made: the name a reference
   * to it would hold.
   */
  key: string;

  /**
   * The subject's durable id, for types which have one.
   */
  id?: string;
}

export interface LedgerRenameRecord extends BaseHistoryRecord {
  kind: 'rename';

  /**
   * The subject as it was before the rename.
   */
  subject: LedgerSubject;

  /**
   * The subject's key after the rename.
   */
  to: string;
}

export interface LedgerDeletedRecord extends BaseHistoryRecord {
  kind: 'deleted';

  /**
   * The subject as it was when deleted.
   */
  subject: LedgerSubject;
}

export type LedgerRecord = LedgerRenameRecord | LedgerDeletedRecord;

/**
 * A change as it is handed over to be recorded in a ledger. This is
 * its record minus the timestamp, which is added when the record is
 * written.
 */
export type LedgerRecordInput = DistributiveOmit<LedgerRecord, 'timestamp'>;
