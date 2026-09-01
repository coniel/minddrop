import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, cleanup, setup } from '../../test-utils';
import { SnapshotManifest } from '../../types';
import { readSnapshotManifest } from './readSnapshotManifest';

const snapshotDirPath = 'Books/.minddrop/history/My Book/2026-09-01T091402Z';

const manifest: SnapshotManifest = {
  capturedAt: new Date('2026-09-01T09:14:02.311Z'),
  cause: 'edit',
  contentHash: 'hash',
};

describe('readSnapshotManifest', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("reads the snapshot's manifest", async () => {
    MockFs.addFiles([
      {
        path: `${snapshotDirPath}/snapshot.json`,
        textContent: JSON.stringify(manifest),
      },
    ]);

    expect(await readSnapshotManifest(snapshotDirPath)).toEqual(manifest);
  });

  it('returns null when there is no manifest', async () => {
    MockFs.addFiles([`${snapshotDirPath}/My Book.md`]);

    expect(await readSnapshotManifest(snapshotDirPath)).toBeNull();
  });

  it('returns null when the manifest cannot be parsed', async () => {
    MockFs.addFiles([
      { path: `${snapshotDirPath}/snapshot.json`, textContent: 'not json' },
    ]);

    expect(await readSnapshotManifest(snapshotDirPath)).toBeNull();
  });
});
