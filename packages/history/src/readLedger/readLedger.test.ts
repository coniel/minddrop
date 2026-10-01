import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, cleanup, setup } from '../test-utils';
import { LedgerRecord } from '../types';
import { readLedger } from './readLedger';

const ledger = { ownerPath: 'Books', type: 'entries' };
const ledgerDirPath = 'Books/.minddrop/ledgers/entries';

const firstRecord: LedgerRecord = {
  timestamp: new Date('2026-09-01T09:14:02.311Z'),
  kind: 'rename',
  subject: { key: 'My Book' },
  to: 'My Renamed Book',
};

const secondRecord: LedgerRecord = {
  timestamp: new Date('2026-09-02T11:00:00.000Z'),
  kind: 'deleted',
  subject: { key: 'My Renamed Book' },
};

/**
 * Writes a log file holding the given records.
 */
function writeLog(fileName: string, records: LedgerRecord[]): void {
  MockFs.addFiles([
    {
      path: `${ledgerDirPath}/${fileName}`,
      textContent: JSON.stringify(records),
    },
  ]);
}

describe('readLedger', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("reads the ledger's records", async () => {
    writeLog('history.json', [firstRecord, secondRecord]);

    expect(await readLedger(ledger)).toEqual([firstRecord, secondRecord]);
  });

  it('merges the archived logs with the active one, oldest first', async () => {
    writeLog('history-20260902T000000000Z.json', [firstRecord]);
    writeLog('history.json', [secondRecord]);

    expect(await readLedger(ledger)).toEqual([firstRecord, secondRecord]);
  });

  it('returns an empty array for a ledger with no records', async () => {
    expect(await readLedger(ledger)).toEqual([]);
  });
});
