import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Fs } from '@minddrop/file-system';
import { registerCountingMockFileSystem } from '@minddrop/file-system/test-utils';
import {
  MockFs,
  cleanup,
  databaseDirPath,
  entries,
  entryFilePath,
  entryStorageDatabase,
  entryStorageEntry1,
  objectDatabase,
  setup,
} from '../test-utils';
import { Database } from '../types';
import { readEntryFilePaths } from './readEntryFilePaths';

describe('readEntryFilePaths', () => {
  beforeEach(() => setup({ loadEntries: false }));

  afterEach(cleanup);

  it("lists a database's entry files", async () => {
    expect((await readEntryFilePaths(objectDatabase)).sort()).toEqual(
      fixtureEntryPaths(objectDatabase),
    );
  });

  it('lists the entry files in an entry-based storage database', async () => {
    expect((await readEntryFilePaths(entryStorageDatabase)).sort()).toEqual(
      fixtureEntryPaths(entryStorageDatabase),
    );
  });

  it('leaves out files which are not entry files', async () => {
    // Add a YAML file into the markdown-serialized database directory
    MockFs.addFiles([`${databaseDirPath(objectDatabase)}/Stray Entry.yaml`]);

    expect(await readEntryFilePaths(objectDatabase)).not.toContain(
      'Stray Entry.yaml',
    );
  });

  it("lists the entry files in an entry's own directory", async () => {
    const dirPath = Fs.parentDirPath(entryFilePath(entryStorageEntry1));

    // Add another entry's directory. It should not be listed.
    MockFs.addFiles([
      `${databaseDirPath(entryStorageDatabase)}/Other/Other.md`,
    ]);

    expect(await readEntryFilePaths(entryStorageDatabase, { dirPath })).toEqual(
      [entryStorageEntry1.path],
    );
  });

  it('does not read a directory too deep to hold entry files', async () => {
    const dirPath = `${databaseDirPath(objectDatabase)}/Folder`;

    // Add a file which would be an entry file at the database's root
    MockFs.addFiles([`${dirPath}/Nested.md`]);

    // Count the directory listings
    const counts = registerCountingMockFileSystem(MockFs);

    try {
      expect(await readEntryFilePaths(objectDatabase, { dirPath })).toEqual([]);
      // Expect no listing. The returned paths cannot show the skip, as
      // the entry file filter leaves out any file below this depth.
      expect([...counts.dirReads.keys()]).toEqual([]);
    } finally {
      counts.restore();
    }
  });
});

/**
 * Returns the paths of a database's fixture entries, sorted.
 *
 * @param database - The database whose entries' paths to return.
 * @returns The entries' paths, relative to the database directory.
 */
function fixtureEntryPaths(database: Database): string[] {
  return entries
    .filter((entry) => entry.database === database.id)
    .map((entry) => entry.path)
    .sort();
}
