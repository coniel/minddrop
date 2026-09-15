import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ContentView, StoredContentView } from '@minddrop/content-views';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import { MockFs, cleanup, databaseDirPath, setup } from '../../test-utils';
import { objectDatabase } from '../../test-utils/fixtures';
import { resolveDatabaseViewFilePath } from '../../utils';
import { onDatabaseViewUpdated } from './database-view-updated';

const { contentView_virtual_1, contentView_gallery_1 } = ContentViewFixtures;

describe('onDatabaseViewUpdated', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it("writes the updated view to the database's views directory", async () => {
    // Create a virtual view owned by this database
    const view: ContentView = {
      ...contentView_virtual_1,
      dataSource: { type: 'database', id: objectDatabase.id },
      owner: objectDatabase.id,
    };

    // Create the updated view
    const updated: ContentView = {
      ...view,
      name: 'Updated Table',
    };

    // Call the handler
    await onDatabaseViewUpdated({ original: view, updated });

    // The view file should contain the updated view
    const storedView = MockFs.readJsonFile<StoredContentView>(
      resolveDatabaseViewFilePath(databaseDirPath(objectDatabase), view.id),
    );

    expect(storedView?.name).toBe('Updated Table');
  });

  it('ignores views without an owner', async () => {
    // Create a view without an owner
    const view: ContentView = {
      ...contentView_gallery_1,
      dataSource: { type: 'database', id: objectDatabase.id },
    };

    // Call the handler with an unowned view
    await onDatabaseViewUpdated({ original: view, updated: view });

    // No view file should be written
    expect(
      MockFs.exists(
        resolveDatabaseViewFilePath(databaseDirPath(objectDatabase), view.id),
      ),
    ).toBe(false);
  });

  it('ignores views not owned by a database', async () => {
    // Create a virtual view owned by an entry
    const view: ContentView = {
      ...contentView_virtual_1,
      dataSource: { type: 'collection', id: 'some-collection' },
      owner: 'database-entry_1',
    };

    // Call the handler
    await onDatabaseViewUpdated({ original: view, updated: view });

    // No view file should be written
    expect(
      MockFs.exists(
        resolveDatabaseViewFilePath(databaseDirPath(objectDatabase), view.id),
      ),
    ).toBe(false);
  });
});
