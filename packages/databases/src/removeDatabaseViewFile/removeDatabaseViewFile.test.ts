import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataView } from '@minddrop/data-views';
import { DataViewFixtures } from '@minddrop/data-views/test-utils';
import { DatabaseNotFoundError } from '../errors';
import {
  MockFs,
  cleanup,
  databaseDirPath,
  objectDatabase,
  setup,
} from '../test-utils';
import { resolveDatabaseViewFilePath } from '../utils';
import { removeDatabaseViewFile } from './removeDatabaseViewFile';

const { dataView_virtual_1 } = DataViewFixtures;

// A virtual view owned by the object database
const view: DataView = {
  ...dataView_virtual_1,
  dataSource: { type: 'database', id: objectDatabase.id },
  owner: objectDatabase.id,
};

// Path to the view's file
const viewFilePath = resolveDatabaseViewFilePath(
  databaseDirPath(objectDatabase),
  view.id,
);

describe('removeDatabaseViewFile', () => {
  beforeEach(() => {
    setup();

    // Add the view's file to the file system
    MockFs.addFiles([viewFilePath]);
  });

  afterEach(cleanup);

  it("deletes the view's file", async () => {
    await removeDatabaseViewFile(view);

    expect(MockFs.exists(viewFilePath)).toBe(false);
  });

  it("throws when the view's database does not exist", async () => {
    // Create a view owned by a missing database
    const orphanedView: DataView = { ...view, owner: 'database_missing' };

    await expect(removeDatabaseViewFile(orphanedView)).rejects.toThrow(
      DatabaseNotFoundError,
    );

    // The file should be untouched
    expect(MockFs.exists(viewFilePath)).toBe(true);
  });

  it('does nothing when the file does not exist', async () => {
    // Remove the view's file
    MockFs.removeFile(viewFilePath);

    // Should not throw
    await expect(removeDatabaseViewFile(view)).resolves.toBeUndefined();
  });
});
