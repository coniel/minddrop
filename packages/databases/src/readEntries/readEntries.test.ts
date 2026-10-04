import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  MockFs,
  cleanup,
  databaseDirPath,
  entries,
  entryStorageDatabase,
  entryStorageEntry1,
  objectDatabase,
  objectEntry1,
  setup,
} from '../test-utils';
import { resolveEntryPath } from '../utils';
import { readEntries } from './readEntries';

describe('readEntries', () => {
  beforeEach(() => setup({ loadEntries: false }));

  afterEach(cleanup);

  it('reads and deserializes entry files from a database', async () => {
    // Read entries from the object database
    const result = await readEntries(objectDatabase);

    // Should contain the expected entry with correct data
    const entry = result.find((entry) => entry.path === objectEntry1.path);
    expect(entry).toEqual({
      ...objectEntry1,
      id: expect.any(String),
      contentHash: expect.any(String),
    });
  });

  it('reads entries from an entry-based storage database', async () => {
    // Read entries from a database with entry-based storage
    const result = await readEntries(entryStorageDatabase);

    // Should contain the expected entry
    const entry = result.find(
      (entry) => entry.path === entryStorageEntry1.path,
    );
    expect(entry).toEqual({
      ...entryStorageEntry1,
      id: expect.any(String),
      contentHash: expect.any(String),
    });
  });

  it('filters out non-matching file extensions', async () => {
    // Add a YAML file into the markdown-serialized database directory
    MockFs.addFiles([`${databaseDirPath(objectDatabase)}/Stray Entry.yaml`]);

    // Read entries from the markdown database
    const result = await readEntries(objectDatabase);

    // Should not include the YAML file
    expect(result.every((entry) => entry.path.endsWith('.md'))).toBe(true);
    expect(result.some((entry) => entry.path.endsWith('.yaml'))).toBe(false);
  });

  it('returns an empty array when the database directory has no entries', async () => {
    // Remove all entry files belonging to the object database
    const objectEntries = entries.filter(
      (entry) => entry.database === objectDatabase.id,
    );

    for (const entry of objectEntries) {
      MockFs.removeFile(resolveEntryPath(entry, objectDatabase));
    }

    // Read entries from the now-empty database
    const result = await readEntries(objectDatabase);

    expect(result).toEqual([]);
  });
});
