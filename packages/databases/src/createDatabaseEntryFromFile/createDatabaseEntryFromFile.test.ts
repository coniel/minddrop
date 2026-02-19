import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Fs } from '@minddrop/file-system';
import { InvalidParameterError } from '@minddrop/utils';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabasesStore } from '../DatabasesStore';
import {
  MockFs,
  cleanup,
  genericFilePropertyName,
  imagePropertyName,
  invalidImagePropertyFile,
  rootStorageDatabase,
  setup,
  validImagePropertyFile,
} from '../test-utils';
import { createDatabaseEntryFromFile } from './createDatabaseEntryFromFile';

describe('createDatabaseEntryFromFile', () => {
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
      createDatabaseEntryFromFile(
        rootStorageDatabase.id,
        invalidImagePropertyFile,
      ),
    ).rejects.toThrowError(InvalidParameterError);
  });

  it('creates a database entry', async () => {
    const entry = await createDatabaseEntryFromFile(
      rootStorageDatabase.id,
      validImagePropertyFile,
    );

    expect(entry.title).toBe(Fs.removeExtension(validImagePropertyFile.name));
    expect(DatabaseEntriesStore.get(entry.id)).toBeDefined();
  });

  it('writes the file and updates the property value', async () => {
    const entry = await createDatabaseEntryFromFile(
      rootStorageDatabase.id,
      validImagePropertyFile,
    );

    expect(
      MockFs.exists(
        Fs.concatPath(
          rootStorageDatabase.path,
          entry.properties[imagePropertyName] as string,
        ),
      ),
    ).toBe(true);
    expect(entry.properties[imagePropertyName]).toBe(
      validImagePropertyFile.name,
    );
  });
});
