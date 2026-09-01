import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, cleanup, setup } from '../test-utils';
import { SnapshotManifest } from '../types';
import { listSnapshots } from './listSnapshots';

const ownerPath = 'Books';
const subjectKey = 'My Book';
const historyDirPath = 'Books/.minddrop/history/My Book';

const firstManifest: SnapshotManifest = {
  capturedAt: new Date('2026-09-01T09:14:02.311Z'),
  cause: 'edit',
  contentHash: 'first',
};

const secondManifest: SnapshotManifest = {
  capturedAt: new Date('2026-09-02T11:00:00.000Z'),
  cause: 'edit',
  contentHash: 'second',
};

/**
 * Writes a snapshot into the subject's history directory, as a
 * capture would.
 */
function writeSnapshot(dirName: string, manifest: SnapshotManifest): string {
  const path = `${historyDirPath}/${dirName}`;

  MockFs.addFiles([
    { path: `${path}/My Book.md`, textContent: manifest.contentHash },
    { path: `${path}/snapshot.json`, textContent: JSON.stringify(manifest) },
  ]);

  return path;
}

describe('listSnapshots', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("lists the subject's snapshots, most recent first", async () => {
    writeSnapshot('2026-09-01T091402Z', firstManifest);
    const secondPath = writeSnapshot('2026-09-02T110000Z', secondManifest);

    const snapshots = await listSnapshots({ ownerPath, subjectKey });

    expect(snapshots).toHaveLength(2);
    expect(snapshots[0]).toEqual({ ...secondManifest, path: secondPath });
  });

  it('ignores directories which are not snapshots', async () => {
    writeSnapshot('2026-09-01T091402Z', firstManifest);
    MockFs.addFiles([
      { path: `${historyDirPath}/notes/note.md`, textContent: 'A note' },
    ]);

    expect(await listSnapshots({ ownerPath, subjectKey })).toHaveLength(1);
  });

  it('ignores snapshots whose manifest cannot be read', async () => {
    writeSnapshot('2026-09-01T091402Z', firstManifest);
    MockFs.addFiles([
      {
        path: `${historyDirPath}/2026-09-02T110000Z/My Book.md`,
        textContent: 'No manifest',
      },
    ]);

    expect(await listSnapshots({ ownerPath, subjectKey })).toHaveLength(1);
  });

  it('returns an empty array for subjects with no history', async () => {
    expect(await listSnapshots({ ownerPath, subjectKey })).toEqual([]);
  });
});
