import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, cleanup, setup } from '../../test-utils';
import { HistoryRecord } from '../../types';
import { readLogFiles } from './readLogFiles';

const ownerPath = 'Books';
const subjectKey = 'My Book';
const historyDirPath = 'Books/.minddrop/history/My Book';

const firstRecord: HistoryRecord = {
  timestamp: new Date('2026-09-01T09:14:02.311Z'),
  kind: 'created',
};

const secondRecord: HistoryRecord = {
  timestamp: new Date('2026-09-02T11:00:00.000Z'),
  kind: 'deleted',
};

/**
 * Writes a log file holding the given records.
 */
function writeLog(fileName: string, records: HistoryRecord[]): void {
  MockFs.addFiles([
    {
      path: `${historyDirPath}/${fileName}`,
      textContent: JSON.stringify(records),
    },
  ]);
}

describe('readLogFiles', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('merges every log file, oldest record first', async () => {
    writeLog('history.json', [secondRecord]);
    writeLog('history-20260902T000000000Z.json', [firstRecord]);

    expect(await readLogFiles(ownerPath, subjectKey)).toEqual([
      firstRecord,
      secondRecord,
    ]);
  });

  it('ignores files which are not logs', async () => {
    writeLog('history.json', [firstRecord]);
    MockFs.addFiles([
      {
        path: `${historyDirPath}/content/20260901T091402311Z.md`,
        textContent: 'Body',
      },
    ]);

    expect(await readLogFiles(ownerPath, subjectKey)).toEqual([firstRecord]);
  });

  it('ignores a log which cannot be parsed', async () => {
    writeLog('history.json', [firstRecord]);
    MockFs.addFiles([
      {
        path: `${historyDirPath}/history-broken.json`,
        textContent: 'not json',
      },
    ]);

    expect(await readLogFiles(ownerPath, subjectKey)).toEqual([firstRecord]);
  });

  it('returns an empty array for a subject with no history', async () => {
    expect(await readLogFiles(ownerPath, subjectKey)).toEqual([]);
  });
});
