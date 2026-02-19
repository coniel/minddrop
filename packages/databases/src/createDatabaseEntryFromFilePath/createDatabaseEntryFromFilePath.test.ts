import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Fs } from '@minddrop/file-system';
import { titleFromPath } from '@minddrop/utils';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabasesStore } from '../DatabasesStore';
import {
  MockFs,
  cleanup,
  imagePropertyName,
  invalidImagePropertyFile,
  rootStorageDatabase,
  setup,
  validImagePropertyFile,
} from '../test-utils';
import { createDatabaseEntryFromFilePath } from './createDatabaseEntryFromFilePath';

const invalidFilePath = Fs.concatPath('path/to', invalidImagePropertyFile.name);
const validFilePath = Fs.concatPath('path/to', validImagePropertyFile.name);

describe('createDatabaseEntryFromFilePath', () => {
  beforeEach(() => {
    setup();

    MockFs.addFiles([invalidFilePath, validFilePath]);
  });

  afterEach(cleanup);

  it('throws if the database does not support the file type', async () => {
    // Remove file based properties from the database
    DatabasesStore.update(rootStorageDatabase.id, {
      properties: [],
    });

    await expect(() =>
      createDatabaseEntryFromFilePath(rootStorageDatabase.id, invalidFilePath),
    ).rejects.toThrowError();
  });

  it('creates a database entry from a file path', async () => {
    const entry = await createDatabaseEntryFromFilePath(
      rootStorageDatabase.id,
      validFilePath,
    );

    expect(entry.title).toBe(titleFromPath(validFilePath));
    expect(DatabaseEntriesStore.get(entry.id)).toBeDefined();
  });

  it('copies the file to the property file path', async () => {
    await createDatabaseEntryFromFilePath(
      rootStorageDatabase.id,
      validFilePath,
    );

    expect(
      MockFs.exists(
        Fs.concatPath(rootStorageDatabase.path, validImagePropertyFile.name),
      ),
    ).toBe(true);
  });

  it('updates the property value', async () => {
    const entry = await createDatabaseEntryFromFilePath(
      rootStorageDatabase.id,
      validFilePath,
    );

    expect(entry.properties[imagePropertyName]).toBe(
      validImagePropertyFile.name,
    );
  });

  it('handles file name conflicts', async () => {
    // Create an entry from the file path
    await createDatabaseEntryFromFilePath(
      rootStorageDatabase.id,
      validFilePath,
    );

    // Create a second entry from the same file path
    const entry = await createDatabaseEntryFromFilePath(
      rootStorageDatabase.id,
      validFilePath,
    );

    expect(entry.properties[imagePropertyName]).toBe(
      Fs.setPathIncrement(validImagePropertyFile.name, 1),
    );
  });
});
