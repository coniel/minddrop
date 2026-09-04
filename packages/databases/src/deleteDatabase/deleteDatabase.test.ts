import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseNotFoundError } from '../errors';
import { DatabaseDeletedEvent } from '../events';
import { MockFs, cleanup, objectDatabase, setup } from '../test-utils';
import { deleteDatabase } from './deleteDatabase';

describe('deleteDatabase', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the database does not exist', async () => {
    // Deleting a missing database should throw
    await expect(deleteDatabase('missing')).rejects.toThrow(
      DatabaseNotFoundError,
    );
  });

  it('moves the database directory to the system trash', async () => {
    await deleteDatabase(objectDatabase.id);

    // The database directory should now be in the trash
    expect(MockFs.existsInTrash(objectDatabase.path)).toBe(true);
    expect(MockFs.exists(objectDatabase.path)).toBe(false);
  });

  it('removes the database from the store', async () => {
    await deleteDatabase(objectDatabase.id);

    // The store should no longer contain the database
    expect(DatabasesStore.get(objectDatabase.id)).toBeNull();
  });

  it('dispatches a database deleted event', async () =>
    new Promise<void>((done) => {
      Events.addListener(DatabaseDeletedEvent, 'test', (data) => {
        // Payload should be the deleted database
        expect(data).toEqual(objectDatabase);
        done();
      });

      deleteDatabase(objectDatabase.id);
    }));
});
