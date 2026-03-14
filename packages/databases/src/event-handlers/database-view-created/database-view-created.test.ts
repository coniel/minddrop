import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { View, ViewFixtures, Views } from '@minddrop/views';
import { DatabasesStore } from '../../DatabasesStore';
import { cleanup, setup } from '../../test-utils';
import { objectDatabase } from '../../test-utils/fixtures';
import { onDatabaseViewCreated } from './database-view-created';

const { view_virtual_1, view_gallery_1 } = ViewFixtures;

vi.mock('../../writeDatabaseConfig', () => ({
  writeDatabaseConfig: vi.fn(),
}));

describe('onDatabaseViewCreated', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('persists the view to the database config', () => {
    // Create a virtual view for this database
    const view: View = {
      ...view_virtual_1,
      dataSource: { type: 'database', id: objectDatabase.id },
    };

    // Add the view to the store (simulates what happens before
    // the event fires)
    Views.Store.add(view);

    // Call the handler
    onDatabaseViewCreated(view);

    // The database should have the view in its views array
    const database = DatabasesStore.get(objectDatabase.id);

    expect(database!.views).toHaveLength(1);
    expect(database!.views![0].id).toBe(view_virtual_1.id);
  });

  it('ignores views that do not belong to a database', () => {
    // Create a view with a non-database data source
    const view: View = {
      ...view_gallery_1,
      dataSource: { type: 'collection', id: 'some-collection' },
    };

    // Call the handler
    onDatabaseViewCreated(view);

    // The database should not have been updated
    const database = DatabasesStore.get(objectDatabase.id);

    expect(database!.views).toBeUndefined();
  });
});
