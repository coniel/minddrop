import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, cleanup, setup } from '../test-utils';
import { HistoryRecord } from '../types';
import { readHistory } from './readHistory';

const ownerPath = 'Books';
const subjectKey = 'My Book';
const historyDirPath = 'Books/.minddrop/history/My Book';

const firstRecord: HistoryRecord = {
  timestamp: new Date('2026-09-01T09:14:02.311Z'),
  kind: 'created',
};

const secondRecord: HistoryRecord = {
  timestamp: new Date('2026-09-02T11:00:00.000Z'),
  kind: 'property',
  changes: [{ property: 'Status', from: 'Planned', to: 'Done' }],
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

describe('readHistory', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("reads the subject's records", async () => {
    writeLog('history.json', [firstRecord, secondRecord]);

    expect(await readHistory({ ownerPath, subjectKey })).toEqual([
      firstRecord,
      secondRecord,
    ]);
  });

  it('merges the archived logs with the active one, oldest first', async () => {
    writeLog('history-20260902T000000000Z.json', [firstRecord]);
    writeLog('history.json', [secondRecord]);

    expect(await readHistory({ ownerPath, subjectKey })).toEqual([
      firstRecord,
      secondRecord,
    ]);
  });

  it('merges a conflicted copy left by sync', async () => {
    writeLog('history.json', [firstRecord]);
    writeLog('history (conflicted copy).json', [secondRecord]);

    expect(await readHistory({ ownerPath, subjectKey })).toHaveLength(2);
  });

  it('ignores a log which cannot be read', async () => {
    writeLog('history.json', [firstRecord]);
    MockFs.addFiles([
      {
        path: `${historyDirPath}/history-20260902T000000000Z.json`,
        textContent: 'not json',
      },
    ]);

    expect(await readHistory({ ownerPath, subjectKey })).toEqual([firstRecord]);
  });

  it('ignores the content directory', async () => {
    writeLog('history.json', [firstRecord]);
    MockFs.addFiles([
      {
        path: `${historyDirPath}/content/20260901T091402311Z.md`,
        textContent: 'Body',
      },
    ]);

    expect(await readHistory({ ownerPath, subjectKey })).toEqual([firstRecord]);
  });

  it('returns an empty array for subjects with no history', async () => {
    expect(await readHistory({ ownerPath, subjectKey })).toEqual([]);
  });
});
