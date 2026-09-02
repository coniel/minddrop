import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LogSizeLimitBytes } from '../constants';
import { MockFs, cleanup, setup } from '../test-utils';
import { HistoryRecord } from '../types';
import { readHistoryLog } from './readHistoryLog';

const historyDirPath = 'Books/.minddrop/history/My Book';
const logFilePath = `${historyDirPath}/history.json`;

const record: HistoryRecord = {
  timestamp: new Date('2026-09-01T09:14:02.311Z'),
  kind: 'created',
};

/**
 * Writes the active log with the given contents.
 */
function writeLog(textContent: string): void {
  MockFs.addFiles([{ path: logFilePath, textContent }]);
}

/**
 * Returns whether the log has been archived.
 */
function wasArchived(): boolean {
  return MockFs.exists(`${historyDirPath}/history-20260601T000000000Z.json`);
}

describe('readHistoryLog', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the records in the log', async () => {
    writeLog(JSON.stringify([record]));

    expect(await readHistoryLog(logFilePath)).toEqual([record]);
  });

  it('revives the record timestamps as dates', async () => {
    writeLog(JSON.stringify([record]));

    const [read] = await readHistoryLog(logFilePath);

    expect(read.timestamp).toBeInstanceOf(Date);
  });

  it('returns an empty array when there is no log', async () => {
    expect(await readHistoryLog(logFilePath)).toEqual([]);
  });

  it('archives the log once it outgrows its size limit', async () => {
    writeLog(JSON.stringify([record]).padEnd(LogSizeLimitBytes, ' '));

    // The records move to the archive, leaving nothing to append to
    expect(await readHistoryLog(logFilePath)).toEqual([]);
    expect(wasArchived()).toBe(true);
  });

  it('archives a log which cannot be parsed rather than writing over it', async () => {
    writeLog('not json');

    expect(await readHistoryLog(logFilePath)).toEqual([]);
    expect(wasArchived()).toBe(true);
  });

  it('ignores a log which does not hold an array', async () => {
    writeLog('{ "records": [] }');

    expect(await readHistoryLog(logFilePath)).toEqual([]);
  });
});
