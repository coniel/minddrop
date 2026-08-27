import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DataView, DataViews } from '@minddrop/data-views';
import { DataViewFixtures } from '@minddrop/data-views/test-utils';
import { DatabasesStore } from '../DatabasesStore';
import { cleanup, setup } from '../test-utils';
import { objectDatabase, objectEntry1 } from '../test-utils/fixtures';
import { writeDatabaseViews } from './writeDatabaseViews';

const { dataView_virtual_1 } = DataViewFixtures;

vi.mock('../writeDatabaseConfig', () => ({
  writeDatabaseConfig: vi.fn(),
}));

describe('writeDatabaseViews', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('adds database views to the database without runtime fields', async () => {
    // Add a virtual view owned by the database to the ViewsStore
    const view: DataView = {
      ...dataView_virtual_1,
      dataSource: { type: 'database', id: objectDatabase.id },
      owner: objectDatabase.id,
      options: { sortBy: 'name' },
    };

    DataViews.Store.set(view);

    // Write the views
    await writeDatabaseViews(objectDatabase.id);

    // The database in the store should have the views without
    // dataSource, virtual, and owner
    const database = DatabasesStore.get(objectDatabase.id);

    expect(database!.views).toHaveLength(1);
    expect(database!.views![0].id).toBe(dataView_virtual_1.id);
    expect(database!.views![0].options).toEqual({ sortBy: 'name' });
    expect((database!.views![0] as DataView).dataSource).toBeUndefined();
    expect((database!.views![0] as DataView).virtual).toBeUndefined();
    expect((database!.views![0] as DataView).owner).toBeUndefined();
    expect((database!.views![0] as DataView).ownerKey).toBeUndefined();
  });

  it('only includes views owned by the specified database', async () => {
    // Add a view owned by this database
    const thisDbView: DataView = {
      ...dataView_virtual_1,
      dataSource: { type: 'database', id: objectDatabase.id },
      owner: objectDatabase.id,
    };

    DataViews.Store.set(thisDbView);

    // Add a view owned by a different database
    const otherDbView: DataView = {
      ...dataView_virtual_1,
      id: 'view-other-db',
      dataSource: { type: 'database', id: 'other-db' },
      owner: 'database_other',
    };

    DataViews.Store.set(otherDbView);

    // Write views for the object database
    await writeDatabaseViews(objectDatabase.id);

    // Should only include the view owned by the object database
    const database = DatabasesStore.get(objectDatabase.id);

    expect(database!.views).toHaveLength(1);
    expect(database!.views![0].id).toBe(dataView_virtual_1.id);
  });

  it('ignores views owned by an entry', async () => {
    // Add a view owned by the database
    const databaseView: DataView = {
      ...dataView_virtual_1,
      dataSource: { type: 'database', id: objectDatabase.id },
      owner: objectDatabase.id,
    };

    DataViews.Store.set(databaseView);

    // Add an entry-owned view sourced from the same database
    const entryView: DataView = {
      ...dataView_virtual_1,
      id: 'view-entry-owned',
      dataSource: { type: 'database', id: objectDatabase.id },
      owner: objectEntry1.id,
    };

    DataViews.Store.set(entryView);

    // Write views for the object database
    await writeDatabaseViews(objectDatabase.id);

    // Should only include the database-owned view
    const database = DatabasesStore.get(objectDatabase.id);

    expect(database!.views).toHaveLength(1);
    expect(database!.views![0].id).toBe(dataView_virtual_1.id);
  });

  it('returns early if the database does not exist', async () => {
    // Should not throw
    await writeDatabaseViews('nonexistent-database');
  });

  it('writes an empty views array when no views exist', async () => {
    // Clear all views
    DataViews.Store.clear();

    // Write the views
    await writeDatabaseViews(objectDatabase.id);

    // Should have an empty views array
    const database = DatabasesStore.get(objectDatabase.id);

    expect(database!.views).toEqual([]);
  });
});
