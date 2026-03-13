import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  MockFs,
  cleanup,
  databaseEntries,
  entryStorageDatabase,
  entryStorageEntry1,
  objectDatabase,
  objectEntry1,
  setup,
} from '../test-utils';
import { readDatabaseEntries } from './readDatabaseEntries';

describe('readDatabaseEntries', () => {
  beforeEach(() => setup({ loadDatabaseEntries: false }));

  afterEach(cleanup);

  it('reads and deserializes entry files from a database', async () => {
    // Read entries from the object database
    const entries = await readDatabaseEntries(objectDatabase);

    // Should contain the expected entry with correct data
    const entry = entries.find((entry) => entry.id === objectEntry1.id);
    expect(entry).toEqual(objectEntry1);
  });

  it('reads entries from an entry-based storage database', async () => {
    // Read entries from a database with entry-based storage
    const entries = await readDatabaseEntries(entryStorageDatabase);

    // Should contain the expected entry
    const entry = entries.find((entry) => entry.id === entryStorageEntry1.id);
    expect(entry).toEqual(entryStorageEntry1);
  });

  it('filters out non-matching file extensions', async () => {
    // Add a YAML file into the markdown-serialized database directory
    MockFs.addFiles([`${objectDatabase.path}/Stray Entry.yaml`]);

    // Read entries from the markdown database
    const entries = await readDatabaseEntries(objectDatabase);

    // Should not include the YAML file
    expect(entries.every((entry) => entry.path.endsWith('.md'))).toBe(true);
    expect(entries.some((entry) => entry.path.endsWith('.yaml'))).toBe(false);
  });

  it('returns an empty array when the database directory has no entries', async () => {
    // Remove all entry files belonging to the object database
    const objectEntries = databaseEntries.filter(
      (entry) => entry.database === objectDatabase.id,
    );

    for (const entry of objectEntries) {
      MockFs.removeFile(entry.path);
    }

    // Read entries from the now-empty database
    const entries = await readDatabaseEntries(objectDatabase);

    expect(entries).toEqual([]);
  });
});
