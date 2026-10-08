import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { registerMockAdapterOverrides } from '@minddrop/file-system/test-utils';
import { readHistory } from '../readHistory';
import { MockFs, cleanup, setup } from '../test-utils';
import { HistoryRecord } from '../types';
import { moveHistory } from './moveHistory';

const ownerPath = 'Books';
const subjectType = 'entries';
const fromKey = 'My Book';
const toKey = 'My Renamed Book';
const fromPath = 'Books/.minddrop/history/entries/My Book';
const toPath = 'Books/.minddrop/history/entries/My Renamed Book';

const movedRecord: HistoryRecord = {
  timestamp: new Date('2026-09-01T09:14:02.311Z'),
  kind: 'created',
};

const heldRecord: HistoryRecord = {
  timestamp: new Date('2026-09-02T11:00:00.000Z'),
  kind: 'deleted',
};

/**
 * Writes a log file holding the given records.
 */
function writeLog(path: string, records: HistoryRecord[]): void {
  MockFs.addFiles([{ path, textContent: JSON.stringify(records) }]);
}

describe('moveHistory', () => {
  beforeEach(() => {
    setup();

    MockFs.addFiles([
      `${fromPath}/history.json`,
      `${fromPath}/content/20260901T091402311Z.md`,
    ]);
  });

  afterEach(cleanup);

  it('moves the history to the new key', async () => {
    await moveHistory({ ownerPath, subjectType, fromKey, toKey });

    expect(MockFs.exists(`${toPath}/history.json`)).toBe(true);
    expect(MockFs.exists(`${toPath}/content`)).toBe(true);
    expect(MockFs.exists(fromPath)).toBe(false);
  });

  it('merges into the history the new key already has', async () => {
    // Add history left behind by an earlier subject of the same name
    MockFs.addFiles([`${toPath}/history-20260101T000000000Z.json`]);

    await moveHistory({ ownerPath, subjectType, fromKey, toKey });

    expect(MockFs.exists(`${toPath}/history.json`)).toBe(true);
    expect(MockFs.exists(`${toPath}/history-20260101T000000000Z.json`)).toBe(
      true,
    );
    expect(MockFs.exists(fromPath)).toBe(false);
  });

  it('merges the content directories when both keys have one', async () => {
    MockFs.addFiles([
      `${toPath}/history.json`,
      `${toPath}/content/20260902T110000000Z.md`,
    ]);

    await moveHistory({ ownerPath, subjectType, fromKey, toKey });

    // The old key's contents must end up under the new key, or the
    // records that moved across would point at nothing.
    expect(MockFs.exists(`${toPath}/content/20260901T091402311Z.md`)).toBe(
      true,
    );
    expect(MockFs.exists(`${toPath}/content/20260902T110000000Z.md`)).toBe(
      true,
    );
  });

  it('leaves a colliding content file behind rather than losing it', async () => {
    const name = '20260901T091402311Z.md';

    MockFs.addFiles([
      { path: `${toPath}/content/${name}`, textContent: 'The new key’s' },
    ]);

    await moveHistory({ ownerPath, subjectType, fromKey, toKey });

    // The file already there keeps its contents, and the one that
    // could not move stays where a user can still find it.
    expect(MockFs.readTextFile(`${toPath}/content/${name}`)).toBe(
      'The new key’s',
    );
    expect(MockFs.exists(`${fromPath}/content/${name}`)).toBe(true);
  });

  it('merges the records of two active logs into one history', async () => {
    writeLog(`${fromPath}/history.json`, [movedRecord]);
    writeLog(`${toPath}/history.json`, [heldRecord]);

    await moveHistory({ ownerPath, subjectType, fromKey, toKey });

    // The arriving log goes in under an archive name, so its records
    // are read as part of the history it joined rather than being
    // stranded under the old key.
    expect(
      await readHistory({ ownerPath, subjectType, subjectKey: toKey }),
    ).toEqual([movedRecord, heldRecord]);
    expect(MockFs.exists(fromPath)).toBe(false);
  });

  it('does nothing when the subject has no history', async () => {
    await moveHistory({
      ownerPath,
      subjectType,
      fromKey: 'Unrecorded Book',
      toKey,
    });

    expect(MockFs.exists(toPath)).toBe(false);
  });

  describe('against a file system refusing non-recursive directory removal', () => {
    // Registers the plain mock adapter again
    let restoreMockAdapter: VoidFunction;

    beforeEach(() => {
      restoreMockAdapter = registerStrictRemoveDirAdapter();
    });

    afterEach(() => restoreMockAdapter());

    // Kept apart from the pin below, which passes on any failure. A
    // file system failing the merge before the removal fails this test
    // instead of passing as the pinned bug.
    it('merges the history into the history the new key already has', async () => {
      // Add history left behind by an earlier subject of the same name
      MockFs.addFiles([`${toPath}/history-20260101T000000000Z.json`]);

      // Move the history, ignoring the removal's rejection. Only the
      // merged files are checked here.
      await moveHistory({ ownerPath, subjectType, fromKey, toKey }).catch(
        () => undefined,
      );

      expect(MockFs.exists(`${toPath}/history.json`)).toBe(true);
      expect(MockFs.exists(`${toPath}/content`)).toBe(true);
    });

    // Pins Issue 56: moveHistory's merge path throws at the final
    // non-recursive removeDir. Remove .fails once fixed.
    it.fails(
      'removes the old key directory after merging into the history the new key already has',
      async () => {
        // Add history left behind by an earlier subject of the same name
        MockFs.addFiles([`${toPath}/history-20260101T000000000Z.json`]);

        await moveHistory({ ownerPath, subjectType, fromKey, toKey });

        expect(MockFs.exists(fromPath)).toBe(false);
      },
    );
  });
});

/**
 * Registers the mock file system adapter with a directory removal which
 * rejects unless the removal is recursive.
 *
 * @returns A function which registers the plain mock adapter again.
 */
function registerStrictRemoveDirAdapter(): VoidFunction {
  // The plain mock adapter
  const adapter = MockFs.MockFs;

  // Override the directory removal
  return registerMockAdapterOverrides(MockFs, {
    removeDir: async (path, options) => {
      // Reject a non-recursive removal
      if (!options?.recursive) {
        throw new Error(`EFAULT: cannot remove directory '${path}'`);
      }

      // Remove the directory with the plain adapter
      return adapter.removeDir(path, options);
    },
  });
}
