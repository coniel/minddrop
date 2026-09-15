import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ContentView, StoredContentView } from '@minddrop/content-views';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import { DatabaseNotFoundError } from '../errors';
import {
  MockFs,
  cleanup,
  databaseDirPath,
  objectDatabase,
  setup,
} from '../test-utils';
import { resolveDatabaseViewFilePath } from '../utils';
import { writeDatabaseView } from './writeDatabaseView';

const { contentView_virtual_1 } = ContentViewFixtures;

// A virtual view owned by the object database
const view: ContentView = {
  ...contentView_virtual_1,
  dataSource: { type: 'database', id: objectDatabase.id },
  owner: objectDatabase.id,
};

// Path to the view's file
const viewFilePath = resolveDatabaseViewFilePath(
  databaseDirPath(objectDatabase),
  view.id,
);

describe('writeDatabaseView', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('writes the view to its file without runtime fields', async () => {
    await writeDatabaseView(view);

    const storedView = MockFs.readJsonFile<StoredContentView>(viewFilePath);

    // The stored view should not contain the derived fields
    expect(storedView).not.toHaveProperty('dataSource');
    expect(storedView).not.toHaveProperty('virtual');
    expect(storedView).not.toHaveProperty('owner');
    expect(storedView).not.toHaveProperty('ownerKey');
    expect(storedView).not.toHaveProperty('references');
    expect(storedView?.id).toBe(view.id);
  });

  it("throws when the view's database does not exist", async () => {
    // Create a view owned by a missing database
    const orphanedView: ContentView = { ...view, owner: 'database_missing' };

    await expect(writeDatabaseView(orphanedView)).rejects.toThrow(
      DatabaseNotFoundError,
    );
  });
});
