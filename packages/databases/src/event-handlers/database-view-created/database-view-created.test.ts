import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataView, DataViews } from '@minddrop/data-views';
import { DataViewFixtures } from '@minddrop/data-views/test-utils';
import { DatabasesStore } from '../../DatabasesStore';
import { cleanup, setup } from '../../test-utils';
import { objectDatabase } from '../../test-utils/fixtures';
import { onDatabaseViewCreated } from './database-view-created';

const { dataView_virtual_1, dataView_gallery_1 } = DataViewFixtures;

describe('onDatabaseViewCreated', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('persists the view to the database config', () => {
    // Create a virtual view owned by this database
    const view: DataView = {
      ...dataView_virtual_1,
      dataSource: { type: 'database', id: objectDatabase.id },
      owner: objectDatabase.id,
    };

    // Add the view to the store (simulates what happens before
    // the event fires)
    DataViews.Store.set(view);

    // Call the handler
    onDatabaseViewCreated(view);

    // The database should have the view in its views array
    const database = DatabasesStore.get(objectDatabase.id);

    expect(database!.views).toHaveLength(1);
    expect(database!.views![0].id).toBe(dataView_virtual_1.id);
  });

  it('ignores views not owned by a database', () => {
    // Create a view without a database owner
    const view: DataView = {
      ...dataView_gallery_1,
      dataSource: { type: 'collection', id: 'some-collection' },
    };

    // Call the handler
    onDatabaseViewCreated(view);

    // The database should not have been updated
    const database = DatabasesStore.get(objectDatabase.id);

    expect(database!.views).toBeUndefined();
  });
});
