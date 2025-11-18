import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseUpdatedEvent } from '../events';
import { MockFs, cleanup, objectDatabase, setup } from '../test-utils';
import { Database } from '../types';
import { databaseConfigFilePath } from '../utils';
import { UpdateDatabaseData, updateDatabase } from './updateDatabase';

const update: UpdateDatabaseData = {
  description: 'An updated description',
};

const updatedConfig = {
  ...objectDatabase,
  ...update,
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
        // Payload data should be the updated database config
        expect(payload.data).toEqual(updatedConfig);
        done();
      });

      updateDatabase(objectDatabase.id, update);
    }));
});
