import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  MockFs,
  cleanup,
  objectDatabase,
  pdfDatabase,
  setup,
} from '../test-utils';
import { createDatabaseEntryFromFilePath } from './createDatabaseEntryFromFilePath';

const textFilePath = 'path/to/test.txt';
const pdfFilePath = 'path/to/test.pdf';

describe.skip('createDatabaseEntryFromFilePath', () => {
  beforeEach(() => {
    setup();

    MockFs.addFiles([textFilePath, pdfFilePath]);
  });

  afterEach(cleanup);

  it('throws if the database is not a file based database', async () => {
    await expect(() =>
      createDatabaseEntryFromFilePath(objectDatabase.id, textFilePath),
    ).rejects.toThrowError();
  });

  it('throws if the file is not a valid file type for the database', async () => {
    await expect(() =>
      createDatabaseEntryFromFilePath(pdfDatabase.id, textFilePath),
    ).rejects.toThrowError();
  });

  it('copies the file to the database directory', async () => {
    const path = `${pdfDatabase.path}/test.pdf`;

    await createDatabaseEntryFromFilePath(pdfDatabase.id, pdfFilePath);

    expect(MockFs.exists(path)).toBeTruthy();
  });

  it('creates a database entry', async () => {
    const entry = await createDatabaseEntryFromFilePath(
      pdfDatabase.id,
      pdfFilePath,
    );

    expect(entry.title).toBe('test');
    expect(entry.path).toBe(`${pdfDatabase.path}/test.pdf`);
  });

  it('increments the file name if a file with the same name already exists', async () => {
    // Create two entries from the same file
    await createDatabaseEntryFromFilePath(pdfDatabase.id, pdfFilePath);
    const entry1 = await createDatabaseEntryFromFilePath(
      pdfDatabase.id,
      pdfFilePath,
    );

    expect(entry1.title).toBe('test 1');
    expect(entry1.path).toBe(`${pdfDatabase.path}/test 1.pdf`);
  });
});
