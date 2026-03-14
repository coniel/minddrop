import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { View, ViewFixtures, Views } from '@minddrop/views';
import { DatabasesStore } from '../../DatabasesStore';
import { cleanup, setup } from '../../test-utils';
import { objectDatabase } from '../../test-utils/fixtures';
import { onDatabaseViewDeleted } from './database-view-deleted';

const { view_virtual_1, view_board_1 } = ViewFixtures;

vi.mock('../../writeDatabaseConfig', () => ({
  writeDatabaseConfig: vi.fn(),
}));

describe('onDatabaseViewDeleted', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('persists the remaining views to the database config', () => {
    // Create two virtual views for this database
    const view1: View = {
      ...view_virtual_1,
      dataSource: { type: 'database', id: objectDatabase.id },
    };

    const view2: View = {
      ...view_board_1,
      id: 'view-virtual-board-1',
      virtual: true,
      dataSource: { type: 'database', id: objectDatabase.id },
    };

    // Add both views to the store
    Views.Store.add(view1);
    Views.Store.add(view2);

    // Remove view1 from the store (simulates what happens
    // before the event fires)
    Views.Store.remove(view_virtual_1.id);

    // Call the handler
    onDatabaseViewDeleted(view1);

    // The database should only have view2
    const database = DatabasesStore.get(objectDatabase.id);

    expect(database!.views).toHaveLength(1);
    expect(database!.views![0].id).toBe('view-virtual-board-1');
  });

  it('ignores views that do not belong to a database', () => {
    // Create a virtual view with a non-database data source
    const view: View = {
      ...view_virtual_1,
      dataSource: { type: 'collection', id: 'some-collection' },
    };

    // Call the handler
    onDatabaseViewDeleted(view);

    // The database should not have been updated
    const database = DatabasesStore.get(objectDatabase.id);

    expect(database!.views).toBeUndefined();
  });
});
