import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { EntriesStore } from '../../EntriesStore';
import {
  cleanup,
  entryStorageDatabase,
  entryStorageEntry1,
  objectDatabase,
  objectEntry1,
  setup,
} from '../../test-utils';
import { findEntriesUnderPath } from './findEntriesUnderPath';

const { workspace_2 } = WorkspaceFixtures;

// The directory holding the entry storage fixture entry
const entryDirPath = entryStorageEntry1.path.split('/')[0];

describe('findEntriesUnderPath', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('finds the entries whose file is under the path', () => {
    expect(findEntriesUnderPath(entryStorageDatabase.id, entryDirPath)).toEqual(
      [entryStorageEntry1],
    );
  });

  it('finds the entry whose file is at the path', () => {
    expect(findEntriesUnderPath(objectDatabase.id, objectEntry1.path)).toEqual([
      objectEntry1,
    ]);
  });

  it('does not find an entry whose path only begins with the same characters', () => {
    expect(
      findEntriesUnderPath(entryStorageDatabase.id, entryDirPath.slice(0, -1)),
    ).toEqual([]);
  });

  it('does not find an entry of another database', () => {
    expect(findEntriesUnderPath(objectDatabase.id, entryDirPath)).toEqual([]);
  });

  it("searches the given workspace's entries", () => {
    // Should not find the active workspace's entry in another one
    expect(
      findEntriesUnderPath(
        entryStorageDatabase.id,
        entryDirPath,
        workspace_2.id,
      ),
    ).toEqual([]);

    EntriesStore.in(workspace_2.id).set(entryStorageEntry1);

    expect(
      findEntriesUnderPath(
        entryStorageDatabase.id,
        entryDirPath,
        workspace_2.id,
      ),
    ).toEqual([entryStorageEntry1]);
  });
});
