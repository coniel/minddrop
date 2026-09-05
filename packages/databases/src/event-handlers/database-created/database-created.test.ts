import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataViews } from '@minddrop/data-views';
import { sqlGetAllDatabases } from '../../sql';
import {
  cleanup,
  cleanupTestSqlDatabase,
  objectDatabase,
  setup,
  setupTestSqlDatabase,
} from '../../test-utils';
import { onCreateDatabase } from './database-created';

describe('onCreateDatabase', () => {
  beforeEach(() => {
    setup();

    // Open an in-memory SQL database
    setupTestSqlDatabase();
  });

  afterEach(async () => {
    cleanupTestSqlDatabase();
    await cleanup();
  });

  it('upserts the database into SQL', () => {
    // Call the handler
    onCreateDatabase(objectDatabase);

    // The database record should be in SQL
    expect(sqlGetAllDatabases()).toContainEqual({
      id: objectDatabase.id,
      name: objectDatabase.name,
      path: objectDatabase.path,
      icon: objectDatabase.icon,
    });
  });

  it('creates a new view for the database', () => {
    // Clear existing views to ensure none exist for this database
    DataViews.Store.clear();

    // Call the handler
    onCreateDatabase(objectDatabase);

    // Should have added a table view for the database to the store
    const views = DataViews.Store.getAllArray();
    const view = views.find(
      (view) =>
        view.type === 'table' && view.dataSource.id === objectDatabase.id,
    );

    expect(view).toBeDefined();
  });
});
