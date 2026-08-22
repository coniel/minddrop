import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DataView, DataViews } from '@minddrop/data-views';
import { DataViewFixtures } from '@minddrop/data-views/test-utils';
import { DatabasesStore } from '../../DatabasesStore';
import { cleanup, setup } from '../../test-utils';
import { objectDatabase } from '../../test-utils/fixtures';
import { onDatabaseViewDeleted } from './database-view-deleted';

const { dataView_virtual_1, dataView_board_1 } = DataViewFixtures;

vi.mock('../../writeDatabaseConfig', () => ({
  writeDatabaseConfig: vi.fn(),
}));

describe('onDatabaseViewDeleted', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('persists the remaining views to the database config', () => {
    // Create two virtual views for this database
    const view1: DataView = {
      ...dataView_virtual_1,
      dataSource: { type: 'database', id: objectDatabase.id },
    };

    const view2: DataView = {
      ...dataView_board_1,
      id: 'view-virtual-board-1',
      virtual: true,
      dataSource: { type: 'database', id: objectDatabase.id },
    };

    // Add both views to the store
    DataViews.Store.set(view1);
    DataViews.Store.set(view2);

    // Remove view1 from the store (simulates what happens
    // before the event fires)
    DataViews.Store.remove(dataView_virtual_1.id);

    // Call the handler
    onDatabaseViewDeleted(view1);

    // The database should only have view2
    const database = DatabasesStore.get(objectDatabase.id);

    expect(database!.views).toHaveLength(1);
    expect(database!.views![0].id).toBe('view-virtual-board-1');
  });

  it('ignores views that do not belong to a database', () => {
    // Create a virtual view with a non-database data source
    const view: DataView = {
      ...dataView_virtual_1,
      dataSource: { type: 'collection', id: 'some-collection' },
    };

    // Call the handler
    onDatabaseViewDeleted(view);

    // The database should not have been updated
    const database = DatabasesStore.get(objectDatabase.id);

    expect(database!.views).toBeUndefined();
  });
});
