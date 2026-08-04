import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseUpdatedEvent } from '../events';
import {
  MockFs,
  cleanup,
  mockDate,
  objectDatabase,
  setup,
} from '../test-utils';
import { Database } from '../types';
import { databaseConfigFilePath } from '../utils';
import { UpdateDatabaseData, updateDatabase } from './updateDatabase';

const update: UpdateDatabaseData = {
  description: 'An updated description',
};

const updatedConfig = {
  ...objectDatabase,
  ...update,
  lastModified: mockDate,
};

describe('updateDatabase', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('should update an database', async () => {
    const result = await updateDatabase(objectDatabase.id, update);

    expect(result).toEqual(updatedConfig);
  });

  it('updates the database config in the store', async () => {
    await updateDatabase(objectDatabase.id, update);

    expect(DatabasesStore.get(objectDatabase.id)).toEqual(updatedConfig);
  });

  it('writes the updated config to the file system', async () => {
    await updateDatabase(objectDatabase.id, update);

    const result = MockFs.readJsonFile<Database>(
      databaseConfigFilePath(updatedConfig.path),
    );

    expect(result.description).toEqual(updatedConfig.description);
  });

  it('dispatches a database updated event', async () =>
    new Promise<void>((done) => {
      Events.addListener(DatabaseUpdatedEvent, 'test', (payload) => {
        // Payload data should contain original and updated configs
        expect(payload.data).toEqual({
          original: objectDatabase,
          updated: updatedConfig,
        });
        done();
      });

      updateDatabase(objectDatabase.id, update);
    }));

  it('rejects name changes', async () => {
    // The name must go through the dedicated rename flow
    await expect(
      updateDatabase(objectDatabase.id, {
        name: 'New Name',
      } as UpdateDatabaseData),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('rejects property file storage changes', async () => {
    // Property file storage must go through its dedicated setter
    await expect(
      updateDatabase(objectDatabase.id, {
        propertyFileStorage: 'root',
      } as UpdateDatabaseData),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('rejects property files directory changes', async () => {
    // The common directory name must go through its dedicated setter
    await expect(
      updateDatabase(objectDatabase.id, {
        propertyFilesDir: 'Assets',
      } as UpdateDatabaseData),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('rejects entry serializer changes', async () => {
    // The entry serializer must go through its dedicated setter
    await expect(
      updateDatabase(objectDatabase.id, {
        entrySerializer: 'json',
      } as UpdateDatabaseData),
    ).rejects.toThrow(InvalidParameterError);
  });
});
