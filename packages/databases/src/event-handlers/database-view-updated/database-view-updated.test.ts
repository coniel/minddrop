import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataView, StoredDataView } from '@minddrop/data-views';
import { DataViewFixtures } from '@minddrop/data-views/test-utils';
import { MockFs, cleanup, databaseDirPath, setup } from '../../test-utils';
import { objectDatabase } from '../../test-utils/fixtures';
import { resolveDatabaseViewFilePath } from '../../utils';
import { onDatabaseViewUpdated } from './database-view-updated';

const { dataView_virtual_1, dataView_gallery_1 } = DataViewFixtures;

describe('onDatabaseViewUpdated', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it("writes the updated view to the database's views directory", async () => {
    // Create a virtual view owned by this database
    const view: DataView = {
      ...dataView_virtual_1,
      dataSource: { type: 'database', id: objectDatabase.id },
      owner: objectDatabase.id,
    };

    // Create the updated view
    const updated: DataView = {
      ...view,
      name: 'Updated Table',
    };

    // Call the handler
    await onDatabaseViewUpdated({ original: view, updated });

    // The view file should contain the updated view
    const storedView = MockFs.readJsonFile<StoredDataView>(
      resolveDatabaseViewFilePath(databaseDirPath(objectDatabase), view.id),
    );

    expect(storedView?.name).toBe('Updated Table');
  });

  it('ignores views without an owner', async () => {
    // Create a view without an owner
    const view: DataView = {
      ...dataView_gallery_1,
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
    const view: DataView = {
      ...dataView_virtual_1,
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
