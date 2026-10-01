import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, cleanup, mockDate, setup } from '../test-utils';
import { HistoryRecord } from '../types';
import { recordHistory } from './recordHistory';

const subject = {
  ownerPath: 'Books',
  subjectType: 'entries',
  subjectKey: 'My Book',
};
const logFilePath = 'Books/.minddrop/history/entries/My Book/history.json';

/**
 * Reads the active log at a path.
 */
function readLog(path = logFilePath): HistoryRecord[] {
  return MockFs.readJsonFile<HistoryRecord[]>(path);
}

describe('recordHistory', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('records the change against the subject', async () => {
    await recordHistory({ ...subject, kind: 'created' });

    expect(readLog()).toEqual([{ timestamp: mockDate, kind: 'created' }]);
  });

  it("records the change against an owner's own history", async () => {
    await recordHistory({
      ownerPath: 'Books',
      subjectType: 'database',
      kind: 'created',
    });

    expect(readLog('Books/.minddrop/history/database/history.json')).toEqual([
      { timestamp: mockDate, kind: 'created' },
    ]);
  });

  it('returns the recorded change', async () => {
    const record = await recordHistory({ ...subject, kind: 'deleted' });

    expect(record).toEqual({ timestamp: mockDate, kind: 'deleted' });
  });

  it('keeps the order records were made in', async () => {
    // A content change takes longer to build than the others, so the
    // records would otherwise land out of order.
    await Promise.all([
      recordHistory({
        ...subject,
        kind: 'content',
        contents: 'Body',
        extension: 'md',
      }),
      recordHistory({ ...subject, kind: 'deleted' }),
    ]);

    expect(readLog().map((record) => record.kind)).toEqual([
      'content',
      'deleted',
    ]);
  });
});
