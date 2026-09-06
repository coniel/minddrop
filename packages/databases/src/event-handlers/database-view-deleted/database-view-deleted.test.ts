import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataView } from '@minddrop/data-views';
import { DataViewFixtures } from '@minddrop/data-views/test-utils';
import { DatabasesStore } from '../../DatabasesStore';
import { getDatabase } from '../../getDatabase';
import { MockFs, cleanup, setup } from '../../test-utils';
import { objectDatabase } from '../../test-utils/fixtures';
import { resolveDatabaseViewFilePath } from '../../utils';
import { onDatabaseViewDeleted } from './database-view-deleted';

const { dataView_virtual_1 } = DataViewFixtures;

describe('onDatabaseViewDeleted', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it("deletes the view's file from the database's views directory", async () => {
    // Create a virtual view owned by this database
    const view: DataView = {
      ...dataView_virtual_1,
      dataSource: { type: 'database', id: objectDatabase.id },
      owner: objectDatabase.id,
    };

    // Add the view's file to the file system
    MockFs.addFiles([
      resolveDatabaseViewFilePath(objectDatabase.path, view.id),
    ]);

    // Call the handler
    await onDatabaseViewDeleted(view);

    // The view's file should be deleted
    expect(
      MockFs.exists(resolveDatabaseViewFilePath(objectDatabase.path, view.id)),
    ).toBe(false);
  });

  it("drops the view from the config's view ID list", async () => {
    // Create a virtual view owned by this database
    const view: DataView = {
      ...dataView_virtual_1,
      dataSource: { type: 'database', id: objectDatabase.id },
      owner: objectDatabase.id,
    };

    // Record the view in the config's view ID list
    DatabasesStore.update(objectDatabase.id, {
      views: [view.id, 'view-other'],
    });

    // Call the handler
    await onDatabaseViewDeleted(view);

    expect(getDatabase(objectDatabase.id).views).toEqual(['view-other']);
  });

  it('ignores views not owned by a database', async () => {
    // Create a virtual view without a database owner
    const view: DataView = {
      ...dataView_virtual_1,
      dataSource: { type: 'collection', id: 'some-collection' },
    };

    // Add a file at the view's would-be path
    MockFs.addFiles([
      resolveDatabaseViewFilePath(objectDatabase.path, view.id),
    ]);

    // Call the handler
    await onDatabaseViewDeleted(view);

    // The file should be untouched
    expect(
      MockFs.exists(resolveDatabaseViewFilePath(objectDatabase.path, view.id)),
    ).toBe(true);
  });
});
