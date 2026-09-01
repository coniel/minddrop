import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, cleanup, setup } from '../test-utils';
import { SnapshotManifest } from '../types';
import { readSnapshot } from './readSnapshot';

const ownerPath = 'Books';
const subjectKey = 'My Book';
const capturedAt = new Date('2026-09-01T09:14:02.311Z');
const snapshotDirPath = 'Books/.minddrop/history/My Book/2026-09-01T091402Z';

const manifest: SnapshotManifest = {
  capturedAt,
  cause: 'edit',
  contentHash: 'hash',
};

describe('readSnapshot', () => {
  beforeEach(() => {
    setup();

    MockFs.addFiles([
      {
        path: `${snapshotDirPath}/snapshot.json`,
        textContent: JSON.stringify(manifest),
      },
    ]);
  });

  afterEach(cleanup);

  it('reads the captured contents', async () => {
    MockFs.writeTextFile(`${snapshotDirPath}/My Book.md`, 'Captured contents');

    expect(await readSnapshot({ ownerPath, subjectKey, capturedAt })).toBe(
      'Captured contents',
    );
  });

  it('returns null when nothing was captured at that time', async () => {
    expect(
      await readSnapshot({
        ownerPath,
        subjectKey,
        capturedAt: new Date('2026-09-02T11:00:00.000Z'),
      }),
    ).toBeNull();
  });

  it('returns null when the snapshot holds only its manifest', async () => {
    expect(
      await readSnapshot({ ownerPath, subjectKey, capturedAt }),
    ).toBeNull();
  });
});
