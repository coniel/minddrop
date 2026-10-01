import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LogSizeLimitBytes } from '../constants';
import { MockFs, cleanup, mockDate, setup } from '../test-utils';
import { HistoryRecord } from '../types';
import { appendLogRecord } from './appendLogRecord';

const logDirPath = 'Books/.minddrop/history/entries/My Book';
const logFilePath = `${logDirPath}/history.json`;

const createdRecord: HistoryRecord = { timestamp: mockDate, kind: 'created' };
const deletedRecord: HistoryRecord = { timestamp: mockDate, kind: 'deleted' };

/**
 * Reads the active log.
 */
function readLog(): HistoryRecord[] {
  return MockFs.readJsonFile<HistoryRecord[]>(logFilePath);
}

describe('appendLogRecord', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('creates the log for a directory with none', async () => {
    await appendLogRecord(logDirPath, async () => createdRecord);

    expect(readLog()).toEqual([createdRecord]);
  });

  it('appends to an existing log, keeping what it holds', async () => {
    await appendLogRecord(logDirPath, async () => createdRecord);
    await appendLogRecord(logDirPath, async () => deletedRecord);

    expect(readLog()).toEqual([createdRecord, deletedRecord]);
  });

  it('returns the appended record', async () => {
    const record = await appendLogRecord(logDirPath, async () => deletedRecord);

    expect(record).toEqual(deletedRecord);
  });

  it('starts a fresh log when the existing one has rolled over', async () => {
    MockFs.addFiles([
      { path: logFilePath, textContent: '[]'.padEnd(LogSizeLimitBytes, ' ') },
    ]);

    await appendLogRecord(logDirPath, async () => createdRecord);

    // The record lands in a log the rollover has just emptied
    expect(readLog()).toEqual([createdRecord]);
    expect(
      MockFs.exists(`${logDirPath}/history-20260601T000000000Z.json`),
    ).toBe(true);
  });

  it('does not lose records appended at the same time', async () => {
    // Appending reads the log it then writes back, so records
    // appended at once would overwrite one another unless they are
    // serialized.
    await Promise.all([
      appendLogRecord(logDirPath, async () => createdRecord),
      appendLogRecord(logDirPath, async () => deletedRecord),
      appendLogRecord(logDirPath, async () => createdRecord),
    ]);

    expect(readLog()).toHaveLength(3);
  });
});
