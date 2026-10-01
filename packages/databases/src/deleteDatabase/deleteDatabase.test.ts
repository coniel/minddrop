import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseHistoryCauses } from '../constants';
import { DatabaseNotFoundError } from '../errors';
import { DatabaseDeletedEvent } from '../events';
import {
  MockFs,
  cleanup,
  databaseDirPath,
  objectDatabase,
  setup,
} from '../test-utils';
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
    expect(MockFs.existsInTrash(databaseDirPath(objectDatabase))).toBe(true);
    expect(MockFs.exists(databaseDirPath(objectDatabase))).toBe(false);
  });

  it('removes the database from the store', async () => {
    await deleteDatabase(objectDatabase.id);

    // The store should no longer contain the database
    expect(DatabasesStore).not.toHaveItem(objectDatabase.id);
  });

  it("trashes the directory only once the deleted event's listeners have settled", async () => {
    // A file inside the database directory
    const markerPath = `${databaseDirPath(objectDatabase)}/marker.txt`;

    // Add a listener which writes into the database directory after an
    // await, as a listener recording the deletion does.
    Events.addListener(DatabaseDeletedEvent, 'test', async () => {
      await Promise.resolve();
      await Fs.writeTextFile(markerPath, '');
    });

    // Delete the database
    await deleteDatabase(objectDatabase.id);

    // Read the trashed directory
    const [trashedDir] = MockFs.getTrash();

    // The listener's file should be in it rather than in a fresh directory
    expect(trashedDir.children).toContainEqual(
      expect.objectContaining({ path: markerPath }),
    );
    expect(MockFs.exists(markerPath)).toBe(false);
  });

  it('dispatches a database deleted event', async () =>
    new Promise<void>((done) => {
      Events.addListener(DatabaseDeletedEvent, 'test', (data) => {
        // Payload should be the deleted database and the action
        // performing the deletion.
        expect(data).toEqual({
          ...objectDatabase,
          action: {
            id: expect.stringMatching(/^action_/),
            cause: DatabaseHistoryCauses.DatabaseDeleted,
          },
        });
        done();
      });

      deleteDatabase(objectDatabase.id);
    }));
});
