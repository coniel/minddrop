import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import {
  MockFs,
  cleanup,
  objectDatabase,
  pdfDatabase,
  setup,
} from '../test-utils';
import { createDatabaseEntryFromFile } from './createDatabaseEntryFromFile';

describe('createDatabaseEntryFromFile', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the database is not a file based database', async () => {
    await expect(() =>
      createDatabaseEntryFromFile(objectDatabase.id, new File([], 'test.txt')),
    ).rejects.toThrowError();
  });

  it('throws if the file is not a valid file type for the database', async () => {
    await expect(() =>
      createDatabaseEntryFromFile(pdfDatabase.id, new File([], 'test.txt')),
    ).rejects.toThrowError();
  });

  it('writes the file to the database directory', async () => {
    const path = `${pdfDatabase.path}/test.pdf`;

    await createDatabaseEntryFromFile(pdfDatabase.id, new File([], 'test.pdf'));

    expect(MockFs.exists(path)).toBeTruthy();
  });

  it('creates a database entry', async () => {
    const entry = await createDatabaseEntryFromFile(
      pdfDatabase.id,
      new File([], 'test.pdf'),
    );

    expect(DatabaseEntriesStore.get(entry.id)).toBe(entry);
  });

  it('increments the file name if a file with the same name already exists', async () => {
    // Create two entries from the same file
    await createDatabaseEntryFromFile(pdfDatabase.id, new File([], 'test.pdf'));
    const entry1 = await createDatabaseEntryFromFile(
      pdfDatabase.id,
      new File([], 'test.pdf'),
    );

    expect(entry1.title).toBe('test 1');
    expect(entry1.path).toBe(`${pdfDatabase.path}/test 1.pdf`);
    expect(MockFs.exists(entry1.path)).toBeTruthy();
  });
});
