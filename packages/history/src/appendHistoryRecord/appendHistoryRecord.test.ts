import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LogSizeLimitBytes } from '../constants';
import { MockFs, cleanup, mockDate, setup } from '../test-utils';
import { HistoryRecord } from '../types';
import { appendHistoryRecord } from './appendHistoryRecord';

const subject = { ownerPath: 'Books', subjectKey: 'My Book' };
const historyDirPath = 'Books/.minddrop/history/My Book';
const logFilePath = `${historyDirPath}/history.json`;

/**
 * Reads the subject's active log.
 */
function readLog(): HistoryRecord[] {
  return MockFs.readJsonFile<HistoryRecord[]>(logFilePath);
}

describe('appendHistoryRecord', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('creates the log for a subject with no history', async () => {
    await appendHistoryRecord({ ...subject, kind: 'created' });

    expect(readLog()).toEqual([{ timestamp: mockDate, kind: 'created' }]);
  });

  it('appends to an existing log, keeping what it holds', async () => {
    await appendHistoryRecord({ ...subject, kind: 'created' });
    await appendHistoryRecord({ ...subject, kind: 'deleted' });

    expect(readLog().map((record) => record.kind)).toEqual([
      'created',
      'deleted',
    ]);
  });

  it('returns the appended record', async () => {
    const record = await appendHistoryRecord({ ...subject, kind: 'deleted' });

    expect(record).toEqual({ timestamp: mockDate, kind: 'deleted' });
  });

  it('starts a fresh log when the existing one has rolled over', async () => {
    MockFs.addFiles([
      { path: logFilePath, textContent: '[]'.padEnd(LogSizeLimitBytes, ' ') },
    ]);

    await appendHistoryRecord({ ...subject, kind: 'created' });

    // The record lands in a log the rollover has just emptied
    expect(readLog()).toEqual([{ timestamp: mockDate, kind: 'created' }]);
    expect(
      MockFs.exists(`${historyDirPath}/history-20260601T000000000Z.json`),
    ).toBe(true);
  });
});
