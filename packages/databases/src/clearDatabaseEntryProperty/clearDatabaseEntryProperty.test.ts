import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InvalidParameterError } from '@minddrop/utils';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { MockFs, cleanup, mockDate, objectEntry1, setup } from '../test-utils';
import { DatabaseEntry } from '../types';
import { clearDatabaseEntryProperty } from './clearDatabaseEntryProperty';

const propertyName = 'Icon';

const clearedEntry: DatabaseEntry = {
  ...objectEntry1,
  properties: { Content: objectEntry1.properties.Content },
  lastModified: mockDate,
};

describe('clearDatabaseEntryProperty', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the property does not exist on the database', async () => {
    await expect(
      clearDatabaseEntryProperty(objectEntry1.id, 'NonExistent'),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('removes the property from the entry', async () => {
    const result = await clearDatabaseEntryProperty(
      objectEntry1.id,
      propertyName,
    );

    expect(result).toEqual(clearedEntry);
    expect(result.properties).not.toHaveProperty(propertyName);
  });

  it('updates the entry in the store', async () => {
    await clearDatabaseEntryProperty(objectEntry1.id, propertyName);

    expect(DatabaseEntriesStore.get(objectEntry1.id)).toEqual(clearedEntry);
  });

  it('writes the updated entry to the file system', async () => {
    await clearDatabaseEntryProperty(objectEntry1.id, propertyName);

    const result = MockFs.readTextFile(objectEntry1.path);

    expect(result).not.toContain(propertyName);
  });
});
