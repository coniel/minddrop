import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ViewFixtures, Views } from '@minddrop/views';
import { cleanup, setup } from '../test-utils';
import { objectDatabase } from '../test-utils/fixtures';
import type { Database } from '../types';
import { loadDatabaseViews } from './loadDatabaseViews';

const { view_virtual_1, view_board_1 } = ViewFixtures;

describe('loadDatabaseViews', () => {
  beforeEach(() => {
    setup();
    Views.Store.clear();
  });
  afterEach(cleanup);

  it('loads database views into the ViewsStore with dataSource and virtual', () => {
    // Create a database with a stored view (without dataSource/virtual)
    const { dataSource, virtual, ...storedView } = view_virtual_1;

    const database: Database = {
      ...objectDatabase,
      views: [storedView],
    };

    // Load the database views
    loadDatabaseViews([database]);

    // Should have loaded the view with dataSource and virtual
    const views = Views.Store.getAll();
    const view = views.find((view) => view.id === view_virtual_1.id);

    expect(view).toBeDefined();
    expect(view!.virtual).toBe(true);
    expect(view!.dataSource).toEqual({
      type: 'database',
      id: objectDatabase.id,
    });
  });

  it('does nothing when databases have no views', () => {
    // Load databases without views
    loadDatabaseViews([objectDatabase]);

    // Store should remain empty
    expect(Views.Store.getAll()).toHaveLength(0);
  });

  it('loads views from multiple databases', () => {
    // Strip dataSource/virtual to create stored views
    const { dataSource: ds1, virtual: v1, ...storedView1 } = view_virtual_1;
    const { dataSource: ds2, ...storedView2 } = view_board_1;

    const database1: Database = {
      ...objectDatabase,
      id: 'db-1',
      views: [storedView1],
    };

    const database2: Database = {
      ...objectDatabase,
      id: 'db-2',
      views: [storedView2],
    };

    // Load views from multiple databases
    loadDatabaseViews([database1, database2]);

    const views = Views.Store.getAll();

    expect(views).toHaveLength(2);

    // Each view should have its database's ID as the dataSource
    const viewA = views.find((view) => view.id === view_virtual_1.id);
    const viewB = views.find((view) => view.id === view_board_1.id);

    expect(viewA!.dataSource.id).toBe('db-1');
    expect(viewB!.dataSource.id).toBe('db-2');
  });
});
