import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, cleanup, mockDate, setup } from '../test-utils';
import { HistoryRecord } from '../types';
import { recordHistory } from './recordHistory';

const subject = { ownerPath: 'Books', subjectKey: 'My Book' };
const logFilePath = 'Books/.minddrop/history/My Book/history.json';

/**
 * Reads the subject's active log.
 */
function readLog(): HistoryRecord[] {
  return MockFs.readJsonFile<HistoryRecord[]>(logFilePath);
}

describe('recordHistory', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('records the change against the subject', async () => {
    await recordHistory({ ...subject, kind: 'created' });

    expect(readLog()).toEqual([{ timestamp: mockDate, kind: 'created' }]);
  });

  it('returns the recorded change', async () => {
    const record = await recordHistory({ ...subject, kind: 'deleted' });

    expect(record).toEqual({ timestamp: mockDate, kind: 'deleted' });
  });

  it('does not lose records made at the same time', async () => {
    // Appending reads the log it then writes back, so records made
    // at once would overwrite one another unless they are serialized.
    await Promise.all([
      recordHistory({ ...subject, kind: 'created' }),
      recordHistory({ ...subject, kind: 'deleted' }),
      recordHistory({
        ...subject,
        kind: 'rename',
        target: 'reference',
        from: 'Books/A',
        to: 'Books/B',
      }),
    ]);

    expect(readLog()).toHaveLength(3);
  });

  it('keeps subjects recorded at the same time apart', async () => {
    await Promise.all([
      recordHistory({ ...subject, kind: 'created' }),
      recordHistory({
        ownerPath: 'Books',
        subjectKey: 'My Other Book',
        kind: 'created',
      }),
    ]);

    expect(readLog()).toHaveLength(1);
    expect(
      MockFs.readJsonFile<HistoryRecord[]>(
        'Books/.minddrop/history/My Other Book/history.json',
      ),
    ).toHaveLength(1);
  });
});
