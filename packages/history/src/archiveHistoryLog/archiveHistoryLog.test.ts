import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, cleanup, setup } from '../test-utils';
import { archiveHistoryLog } from './archiveHistoryLog';

const historyDirPath = 'Books/.minddrop/history/My Book';
const logFilePath = `${historyDirPath}/history.json`;

describe('archiveHistoryLog', () => {
  beforeEach(() => {
    setup();

    MockFs.addFiles([{ path: logFilePath, textContent: '[]' }]);
  });

  afterEach(cleanup);

  it('renames the log to an archive named after the time', async () => {
    await archiveHistoryLog(logFilePath);

    expect(
      MockFs.exists(`${historyDirPath}/history-20260601T000000000Z.json`),
    ).toBe(true);
  });

  it('frees the active log name', async () => {
    await archiveHistoryLog(logFilePath);

    expect(MockFs.exists(logFilePath)).toBe(false);
  });
});
