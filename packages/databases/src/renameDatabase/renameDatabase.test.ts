import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { PathConflictError } from '@minddrop/file-system';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseRenamedEvent } from '../events';
import {
  MockFs,
  cleanup,
  objectDatabase,
  parentDir,
  setup,
  urlDatabase,
} from '../test-utils';
import { databaseConfigFilePath } from '../utils';
import { renameDatabase } from './renameDatabase';

const newName = 'Renamed Objects';
const newPath = `${parentDir}/${newName}`;

describe('renameDatabase', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if a database already exists at the new path', async () => {
    // urlDatabase already occupies its directory
    await expect(
      renameDatabase(objectDatabase.id, urlDatabase.name),
    ).rejects.toThrow(PathConflictError);
  });

  it('renames the database directory on the file system', async () => {
    await renameDatabase(objectDatabase.id, newName);

    // The config file should now live under the new directory
    expect(MockFs.exists(databaseConfigFilePath(newPath))).toBe(true);
    expect(MockFs.exists(databaseConfigFilePath(objectDatabase.path))).toBe(
      false,
    );
  });

  it('updates the database in the store in place', async () => {
    await renameDatabase(objectDatabase.id, newName);

    // The database keeps its key with the new name and path
    const renamed = DatabasesStore.get(objectDatabase.id);
    expect(renamed).toMatchObject({
      id: objectDatabase.id,
      name: newName,
      path: newPath,
    });
  });

  it('dispatches a database renamed event', async () =>
    new Promise<void>((done) => {
      Events.addListener(DatabaseRenamedEvent, 'test', ({ data }) => {
        // Payload should contain the original and renamed database
        expect(data.original).toEqual(objectDatabase);
        expect(data.updated).toMatchObject({
          id: objectDatabase.id,
          name: newName,
          path: newPath,
        });
        done();
      });

      renameDatabase(objectDatabase.id, newName);
    }));

  it('returns the renamed database', async () => {
    const renamed = await renameDatabase(objectDatabase.id, newName);

    expect(renamed).toMatchObject({
      id: objectDatabase.id,
      name: newName,
      path: newPath,
      lastModified: expect.any(Date),
    });
  });
});
