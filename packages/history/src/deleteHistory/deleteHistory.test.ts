import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, cleanup, setup } from '../test-utils';
import { deleteHistory } from './deleteHistory';

const subject = {
  ownerPath: 'Books',
  subjectType: 'entries',
  subjectKey: 'Untitled',
};

const historyDirPath = 'Books/.minddrop/history/entries/Untitled';

describe('deleteHistory', () => {
  beforeEach(() => {
    setup();

    MockFs.addFiles([
      `${historyDirPath}/history.json`,
      `${historyDirPath}/content/20260901T091402311Z.md`,
    ]);
  });

  afterEach(cleanup);

  it("deletes the subject's history", async () => {
    await deleteHistory(subject);

    expect(MockFs.exists(historyDirPath)).toBe(false);
  });

  it('leaves other subjects alone', async () => {
    MockFs.addFiles(['Books/.minddrop/history/entries/My Book/history.json']);

    await deleteHistory(subject);

    expect(MockFs.exists('Books/.minddrop/history/entries/My Book')).toBe(true);
  });

  it('does nothing for a subject with no history', async () => {
    await deleteHistory({ ...subject, subjectKey: 'Unrecorded' });

    expect(MockFs.exists(historyDirPath)).toBe(true);
  });
});
