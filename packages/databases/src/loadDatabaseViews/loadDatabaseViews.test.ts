import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataViews } from '@minddrop/data-views';
import { DataViewFixtures } from '@minddrop/data-views/test-utils';
import { DatabasesStore } from '../DatabasesStore';
import { getDatabase } from '../getDatabase';
import { MockFs, cleanup, databaseDirPath, setup } from '../test-utils';
import { objectDatabase } from '../test-utils/fixtures';
import type { Database } from '../types';
import { resolveDatabasePath, resolveDatabaseViewFilePath } from '../utils';
import { loadDatabaseViews } from './loadDatabaseViews';

const { dataView_virtual_1, dataView_board_1 } = DataViewFixtures;

// The views as stored in view files, without the fields derived
// at load time.
const {
  dataSource: _dataSource1,
  virtual: _virtual1,
  ...storedView1
} = dataView_virtual_1;
const { dataSource: _dataSource2, ...storedView2 } = dataView_board_1;

describe('loadDatabaseViews', () => {
  beforeEach(() => {
    setup();
    DataViews.Store.clear();
  });

  afterEach(cleanup);

  it('loads database views into the ViewsStore with dataSource and virtual', async () => {
    // Add a stored view file to the database's views directory
    MockFs.addFiles([
      {
        path: resolveDatabaseViewFilePath(
          databaseDirPath(objectDatabase),
          storedView1.id,
        ),
        textContent: JSON.stringify(storedView1),
      },
    ]);

    // Load the database views
    await loadDatabaseViews([objectDatabase]);

    // Should have loaded the view with dataSource and virtual
    const views = DataViews.Store.getAllArray();
    const view = views.find((view) => view.id === dataView_virtual_1.id);

    expect(view).toBeDefined();
    expect(view!.virtual).toBe(true);
    expect(view!.dataSource).toEqual({
      type: 'database',
      id: objectDatabase.id,
    });
    expect(view!.owner).toBe(objectDatabase.id);
  });

  it("normalizes the config's view ID list against the views found", async () => {
    // Seed a stale ID in the config's view ID list
    DatabasesStore.update(objectDatabase.id, { views: ['stale'] });

    // Add a stored view file to the database's views directory
    MockFs.addFiles([
      {
        path: resolveDatabaseViewFilePath(
          databaseDirPath(objectDatabase),
          storedView1.id,
        ),
        textContent: JSON.stringify(storedView1),
      },
    ]);

    await loadDatabaseViews([objectDatabase]);

    // The stale ID should be dropped and the found view appended
    expect(getDatabase(objectDatabase.id).views).toEqual([storedView1.id]);
  });

  it('does nothing when databases have no views', async () => {
    // Load databases without stored view files
    await loadDatabaseViews([objectDatabase]);

    // Store should remain empty
    expect(DataViews.Store).toHaveItemCount(0);
  });

  it('loads views from multiple databases', async () => {
    const database1: Database = {
      ...objectDatabase,
      id: 'database_db-1',
      path: `${objectDatabase.path}-1`,
    };

    const database2: Database = {
      ...objectDatabase,
      id: 'database_db-2',
      path: `${objectDatabase.path}-2`,
    };

    // Load the databases into the store
    DatabasesStore.load([database1, database2]);

    // Add a stored view file to each database's views directory
    MockFs.addFiles([
      {
        path: resolveDatabaseViewFilePath(
          resolveDatabasePath(database1),
          storedView1.id,
        ),
        textContent: JSON.stringify(storedView1),
      },
      {
        path: resolveDatabaseViewFilePath(
          resolveDatabasePath(database2),
          storedView2.id,
        ),
        textContent: JSON.stringify(storedView2),
      },
    ]);

    // Load views from multiple databases
    await loadDatabaseViews([database1, database2]);

    const views = DataViews.Store.getAllArray();

    expect(views).toHaveLength(2);

    // Each view should have its database's ID as the dataSource
    const viewA = views.find((view) => view.id === dataView_virtual_1.id);
    const viewB = views.find((view) => view.id === dataView_board_1.id);

    expect(viewA!.dataSource.id).toBe('database_db-1');
    expect(viewB!.dataSource.id).toBe('database_db-2');
  });
});
