import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { View, ViewFixtures, Views } from '@minddrop/views';
import { DatabasesStore } from '../DatabasesStore';
import { cleanup, setup } from '../test-utils';
import { objectDatabase } from '../test-utils/fixtures';
import { writeDatabaseViews } from './writeDatabaseViews';

const { view_virtual_1 } = ViewFixtures;

vi.mock('../writeDatabaseConfig', () => ({
  writeDatabaseConfig: vi.fn(),
}));

describe('writeDatabaseViews', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('adds database views to the database without dataSource and virtual', async () => {
    // Add a virtual view for the database to the ViewsStore
    const view: View = {
      ...view_virtual_1,
      dataSource: { type: 'database', id: objectDatabase.id },
      options: { sortBy: 'name' },
    };

    Views.Store.add(view);

    // Write the views
    await writeDatabaseViews(objectDatabase.id);

    // The database in the store should have the views
    // without dataSource and virtual
    const database = DatabasesStore.get(objectDatabase.id);

    expect(database!.views).toHaveLength(1);
    expect(database!.views![0].id).toBe(view_virtual_1.id);
    expect(database!.views![0].options).toEqual({ sortBy: 'name' });
    expect((database!.views![0] as View).dataSource).toBeUndefined();
    expect((database!.views![0] as View).virtual).toBeUndefined();
  });

  it('only includes views belonging to the specified database', async () => {
    // Add a view belonging to this database
    const thisDbView: View = {
      ...view_virtual_1,
      dataSource: { type: 'database', id: objectDatabase.id },
    };

    Views.Store.add(thisDbView);

    // Add a view belonging to a different database
    const otherDbView: View = {
      ...view_virtual_1,
      id: 'view-other-db',
      dataSource: { type: 'database', id: 'other-db' },
    };

    Views.Store.add(otherDbView);

    // Write views for the object database
    await writeDatabaseViews(objectDatabase.id);

    // Should only include the view for the object database
    const database = DatabasesStore.get(objectDatabase.id);

    expect(database!.views).toHaveLength(1);
    expect(database!.views![0].id).toBe(view_virtual_1.id);
  });

  it('returns early if the database does not exist', async () => {
    // Should not throw
    await writeDatabaseViews('nonexistent-database');
  });

  it('writes an empty views array when no views exist', async () => {
    // Clear all views
    Views.Store.clear();

    // Write the views
    await writeDatabaseViews(objectDatabase.id);

    // Should have an empty views array
    const database = DatabasesStore.get(objectDatabase.id);

    expect(database!.views).toEqual([]);
  });
});
