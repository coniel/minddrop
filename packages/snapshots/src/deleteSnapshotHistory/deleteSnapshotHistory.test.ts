import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getLastCapture, recordCapture } from '../captureRegistry';
import { MockFs, cleanup, setup } from '../test-utils';
import { deleteSnapshotHistory } from './deleteSnapshotHistory';

const ownerPath = 'Books';
const subjectKey = 'Untitled';
const historyDirPath = 'Books/.minddrop/history/Untitled';

describe('deleteSnapshotHistory', () => {
  beforeEach(() => {
    setup();

    MockFs.addFiles([
      `${historyDirPath}/2026-09-01T091402Z/Untitled.md`,
      `${historyDirPath}/2026-09-02T110000Z/Untitled.md`,
    ]);
  });

  afterEach(cleanup);

  it("deletes the subject's history", async () => {
    await deleteSnapshotHistory({ ownerPath, subjectKey });

    expect(MockFs.exists(historyDirPath)).toBe(false);
  });

  it('leaves other subjects alone', async () => {
    MockFs.addFiles([
      'Books/.minddrop/history/My Book/2026-09-01T091402Z/My Book.md',
    ]);

    await deleteSnapshotHistory({ ownerPath, subjectKey });

    expect(MockFs.exists('Books/.minddrop/history/My Book')).toBe(true);
  });

  it("clears the subject's recorded capture", async () => {
    recordCapture(historyDirPath, {
      capturedAt: new Date('2026-09-02T11:00:00.000Z'),
      contentHash: 'hash',
    });

    await deleteSnapshotHistory({ ownerPath, subjectKey });

    expect(getLastCapture(historyDirPath)).toBeNull();
  });

  it('does nothing for a subject which was never captured', async () => {
    await deleteSnapshotHistory({ ownerPath, subjectKey: 'Uncaptured' });

    expect(MockFs.exists(historyDirPath)).toBe(true);
  });
});
