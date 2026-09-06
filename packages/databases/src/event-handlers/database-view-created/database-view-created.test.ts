import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataView } from '@minddrop/data-views';
import { DataViewFixtures } from '@minddrop/data-views/test-utils';
import { getDatabase } from '../../getDatabase';
import { MockFs, cleanup, setup } from '../../test-utils';
import { objectDatabase } from '../../test-utils/fixtures';
import { resolveDatabaseViewFilePath } from '../../utils';
import { onDatabaseViewCreated } from './database-view-created';

const { dataView_virtual_1, dataView_gallery_1 } = DataViewFixtures;

describe('onDatabaseViewCreated', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it("writes the view to the database's views directory", async () => {
    // Create a virtual view owned by this database
    const view: DataView = {
      ...dataView_virtual_1,
      dataSource: { type: 'database', id: objectDatabase.id },
      owner: objectDatabase.id,
    };

    // Call the handler
    await onDatabaseViewCreated(view);

    // The view should be written to its file
    expect(
      MockFs.exists(resolveDatabaseViewFilePath(objectDatabase.path, view.id)),
    ).toBe(true);
  });

  it("records the view in the config's view ID list", async () => {
    // Create a virtual view owned by this database
    const view: DataView = {
      ...dataView_virtual_1,
      dataSource: { type: 'database', id: objectDatabase.id },
      owner: objectDatabase.id,
    };

    // Call the handler
    await onDatabaseViewCreated(view);

    expect(getDatabase(objectDatabase.id).views).toEqual([view.id]);
  });

  it('ignores views not owned by a database', async () => {
    // Create a view without a database owner
    const view: DataView = {
      ...dataView_gallery_1,
      dataSource: { type: 'collection', id: 'some-collection' },
    };

    // Call the handler
    await onDatabaseViewCreated(view);

    // No view file should be written
    expect(
      MockFs.exists(resolveDatabaseViewFilePath(objectDatabase.path, view.id)),
    ).toBe(false);
  });
});
