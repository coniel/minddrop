import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DataView, DataViewFixtures, DataViews } from '@minddrop/data-views';
import { DatabasesStore } from '../../DatabasesStore';
import { cleanup, setup } from '../../test-utils';
import { objectDatabase } from '../../test-utils/fixtures';
import { onDatabaseViewUpdated } from './database-view-updated';

const { dataView_virtual_1, dataView_gallery_1 } = DataViewFixtures;

vi.mock('../../writeDatabaseConfig', () => ({
  writeDatabaseConfig: vi.fn(),
}));

describe('onDatabaseViewUpdated', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('persists the updated view to the database config', () => {
    // Create a virtual view for this database
    const view: DataView = {
      ...dataView_virtual_1,
      dataSource: { type: 'database', id: objectDatabase.id },
    };

    // Add the view to the store
    DataViews.Store.set(view);

    // Create the updated view
    const updated: DataView = {
      ...view,
      name: 'Updated Table',
      options: { sortBy: 'date' },
    };

    // Update the view in the store
    DataViews.Store.update(dataView_virtual_1.id, {
      name: 'Updated Table',
      options: { sortBy: 'date' },
    });

    // Call the handler
    onDatabaseViewUpdated({ original: view, updated });

    // The database should have the updated view
    const database = DatabasesStore.get(objectDatabase.id);

    expect(database!.views).toHaveLength(1);
    expect(database!.views![0].name).toBe('Updated Table');
  });

  it('ignores non-virtual views', () => {
    // Create a non-virtual view
    const view: DataView = {
      ...dataView_gallery_1,
      dataSource: { type: 'database', id: objectDatabase.id },
    };

    // Call the handler with a non-virtual view
    onDatabaseViewUpdated({ original: view, updated: view });

    // The database should not have been updated
    const database = DatabasesStore.get(objectDatabase.id);

    expect(database!.views).toBeUndefined();
  });

  it('ignores views that do not belong to a database', () => {
    // Create a virtual view with a non-database data source
    const view: DataView = {
      ...dataView_virtual_1,
      dataSource: { type: 'collection', id: 'some-collection' },
    };

    // Call the handler
    onDatabaseViewUpdated({ original: view, updated: view });

    // The database should not have been updated
    const database = DatabasesStore.get(objectDatabase.id);

    expect(database!.views).toBeUndefined();
  });
});
