import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { MockFs, cleanup, setup } from '../../test-utils';
import { onDatabaseEntryWritten } from './database-entry-written';

const {
  entryStorageDatabase,
  entryStorageEntry1,
  objectDatabase,
  objectEntry1,
} = DatabaseFixtures;

const historyDirPath = `${objectDatabase.path}/.minddrop/history`;
const previousContents = 'The contents the write replaced';

describe('onDatabaseEntryWritten', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('captures the contents the write replaced', async () => {
    await onDatabaseEntryWritten({
      entry: objectEntry1,
      database: objectDatabase,
      previousContents,
      contents: 'The contents that were written',
    });

    expect(
      MockFs.readTextFile(
        `${historyDirPath}/Test Entry/2026-06-01T000000Z/Test Entry.md`,
      ),
    ).toBe(previousContents);
  });

  it('captures nothing for an entry written for the first time', async () => {
    await onDatabaseEntryWritten({
      entry: objectEntry1,
      database: objectDatabase,
      contents: 'The contents that were written',
    });

    expect(MockFs.exists(`${historyDirPath}/Test Entry`)).toBe(false);
  });

  it('keys history by title whatever the storage layout', async () => {
    await onDatabaseEntryWritten({
      entry: entryStorageEntry1,
      database: entryStorageDatabase,
      previousContents,
      contents: 'The contents that were written',
    });

    // The entry's file sits in a subdirectory of its own, which its
    // history does not follow
    expect(
      MockFs.exists(
        `${entryStorageDatabase.path}/.minddrop/history/Entry Storage Entry 1`,
      ),
    ).toBe(true);
  });
});
