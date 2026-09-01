import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getLastCapture, recordCapture } from '../captureRegistry';
import { MockFs, cleanup, setup } from '../test-utils';
import { moveSnapshotHistory } from './moveSnapshotHistory';

const ownerPath = 'Books';
const fromKey = 'My Book';
const toKey = 'My Renamed Book';
const fromPath = 'Books/.minddrop/history/My Book';
const toPath = 'Books/.minddrop/history/My Renamed Book';

describe('moveSnapshotHistory', () => {
  beforeEach(() => {
    setup();

    MockFs.addFiles([`${fromPath}/2026-09-01T091402Z/My Book.md`]);
  });

  afterEach(cleanup);

  it('moves the history to the new key', async () => {
    await moveSnapshotHistory({ ownerPath, fromKey, toKey });

    expect(MockFs.exists(`${toPath}/2026-09-01T091402Z`)).toBe(true);
    expect(MockFs.exists(fromPath)).toBe(false);
  });

  it('merges into history already held under the new key', async () => {
    // History left behind by an earlier subject of the same name
    MockFs.addFiles([`${toPath}/2026-09-02T110000Z/My Renamed Book.md`]);

    await moveSnapshotHistory({ ownerPath, fromKey, toKey });

    expect(MockFs.exists(`${toPath}/2026-09-01T091402Z`)).toBe(true);
    expect(MockFs.exists(`${toPath}/2026-09-02T110000Z`)).toBe(true);
    expect(MockFs.exists(fromPath)).toBe(false);
  });

  it('leaves snapshots the new key already holds untouched', async () => {
    MockFs.addFiles([`${toPath}/2026-09-01T091402Z/My Renamed Book.md`]);

    await moveSnapshotHistory({ ownerPath, fromKey, toKey });

    // The colliding snapshot stays where it is rather than being
    // overwritten by the one moving in
    expect(
      MockFs.exists(`${toPath}/2026-09-01T091402Z/My Renamed Book.md`),
    ).toBe(true);
    expect(MockFs.exists(`${fromPath}/2026-09-01T091402Z`)).toBe(true);
  });

  it("moves the subject's recorded capture", async () => {
    const record = {
      capturedAt: new Date('2026-09-01T09:14:02.311Z'),
      contentHash: 'hash',
    };

    recordCapture(fromPath, record);

    await moveSnapshotHistory({ ownerPath, fromKey, toKey });

    expect(getLastCapture(toPath)).toEqual(record);
  });

  it('does nothing when the subject has no history', async () => {
    await moveSnapshotHistory({
      ownerPath,
      fromKey: 'Uncaptured Book',
      toKey,
    });

    expect(MockFs.exists(toPath)).toBe(false);
  });
});
