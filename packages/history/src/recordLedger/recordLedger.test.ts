import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createHistoryAction } from '../createHistoryAction';
import { MockFs, cleanup, mockDate, setup } from '../test-utils';
import { LedgerRecord } from '../types';
import { recordLedger } from './recordLedger';

const ledger = { ownerPath: 'Books', type: 'entries' };
const logFilePath = 'Books/.minddrop/ledgers/entries/history.json';

/**
 * Reads the ledger's active log.
 */
function readLog(): LedgerRecord[] {
  return MockFs.readJsonFile<LedgerRecord[]>(logFilePath);
}

describe('recordLedger', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('records the change in the ledger, stamped with the current time', async () => {
    await recordLedger(ledger, {
      kind: 'rename',
      subject: { key: 'My Book' },
      to: 'My Renamed Book',
    });

    expect(readLog()).toEqual([
      {
        timestamp: mockDate,
        kind: 'rename',
        subject: { key: 'My Book' },
        to: 'My Renamed Book',
      },
    ]);
  });

  it('records the action a change was made by', async () => {
    const action = createHistoryAction('entry-deleted');

    await recordLedger(ledger, {
      kind: 'deleted',
      subject: { key: 'My Book', id: 'book-1' },
      action,
    });

    expect(readLog()).toEqual([
      {
        timestamp: mockDate,
        kind: 'deleted',
        subject: { key: 'My Book', id: 'book-1' },
        action,
      },
    ]);
  });

  it('returns the recorded change', async () => {
    const record = await recordLedger(ledger, {
      kind: 'deleted',
      subject: { key: 'My Book' },
    });

    expect(record).toEqual({
      timestamp: mockDate,
      kind: 'deleted',
      subject: { key: 'My Book' },
    });
  });

  it('does not lose records made at the same time', async () => {
    await Promise.all([
      recordLedger(ledger, { kind: 'deleted', subject: { key: 'A' } }),
      recordLedger(ledger, { kind: 'deleted', subject: { key: 'B' } }),
    ]);

    expect(readLog()).toHaveLength(2);
  });
});
