import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Fs } from '@minddrop/file-system';
import { InvalidParameterError } from '@minddrop/utils';
import { DatabasesStore } from '../DatabasesStore';
import { EntriesStore } from '../EntriesStore';
import {
  MockFs,
  cleanup,
  databaseDirPath,
  genericFilePropertyName,
  imagePropertyName,
  invalidImagePropertyFile,
  rootStorageDatabase,
  setup,
  validImagePropertyFile,
} from '../test-utils';
import { createEntryFromFile } from './createEntryFromFile';

describe('createEntryFromFile', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the database does not support the file type', async () => {
    DatabasesStore.update(rootStorageDatabase.id, {
      ...rootStorageDatabase,
      // Remove the generic file property from the database
      properties: rootStorageDatabase.properties.filter(
        (property) => property.name !== genericFilePropertyName,
      ),
    });

    await expect(() =>
      createEntryFromFile(rootStorageDatabase.id, invalidImagePropertyFile),
    ).rejects.toThrowError(InvalidParameterError);
  });

  it('creates a database entry', async () => {
    const entry = await createEntryFromFile(
      rootStorageDatabase.id,
      validImagePropertyFile,
    );

    expect(entry.title).toBe(Fs.removeExtension(validImagePropertyFile.name));
    expect(EntriesStore).toHaveItem(entry.id);
  });

  it('writes the file and updates the property value', async () => {
    const entry = await createEntryFromFile(
      rootStorageDatabase.id,
      validImagePropertyFile,
    );

    expect(
      MockFs.exists(
        Fs.concatPath(
          databaseDirPath(rootStorageDatabase),
          entry.properties[imagePropertyName] as string,
        ),
      ),
    ).toBe(true);
    expect(entry.properties[imagePropertyName]).toBe(
      validImagePropertyFile.name,
    );
  });
});
