import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Views } from '@minddrop/views';
import { cleanup, objectDatabase, setup } from '../../test-utils';
import { onCreateDatabase } from './database-created';

describe('onCreateDatabase', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('creates a new view for the database', () => {
    // Clear existing views to ensure none exist for this database
    Views.Store.clear();

    // Call the handler
    onCreateDatabase(objectDatabase);

    // Should have added a table view for the database to the store
    const views = Views.Store.getAll();
    const view = views.find(
      (view) =>
        view.type === 'table' && view.dataSource.id === objectDatabase.id,
    );

    expect(view).toBeDefined();
  });
});
