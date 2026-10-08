import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ContentViews } from '@minddrop/content-views';
import { History } from '@minddrop/history';
import { sqlGetAllDatabases } from '../../sql';
import {
  cleanup,
  cleanupTestSqlDatabase,
  objectDatabase,
  setup,
  setupTestSqlDatabase,
} from '../../test-utils';
import { hashDatabaseProperties } from '../../utils';
import { resolveDatabaseHistorySubject } from '../../utils';
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

  it('upserts the database into SQL', async () => {
    // Call the handler
    await onCreateDatabase(objectDatabase);

    // The database record should be in SQL
    expect(sqlGetAllDatabases()).toContainEqual({
      id: objectDatabase.id,
      name: objectDatabase.name,
      path: objectDatabase.path,
      icon: objectDatabase.icon,
      propertiesHash: hashDatabaseProperties(objectDatabase.properties),
    });
  });

  it('creates a new view for the database', async () => {
    // Clear existing views to ensure none exist for this database
    ContentViews.Store.clear();

    // Call the handler
    await onCreateDatabase(objectDatabase);

    // Should have added a table view for the database to the store
    const views = ContentViews.Store.getAllArray();
    const view = views.find(
      (view) =>
        view.type === 'table' && view.dataSource.id === objectDatabase.id,
    );

    expect(view).toBeDefined();
  });

  it("opens the database's history", async () => {
    // Call the handler
    await onCreateDatabase(objectDatabase);

    // The database's history should start with its creation
    expect(
      await History.read(resolveDatabaseHistorySubject(objectDatabase)),
    ).toEqual([expect.objectContaining({ kind: 'created' })]);
  });
});
