import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanupWorkspaceFixtures,
  setupWorkspaceFixtures,
} from '@minddrop/workspaces/test-utils';
import {
  MockFs,
  cleanupTestSqlDatabase,
  objectDatabase,
  objectEntry1SqlRecord,
  setupTestSqlDatabase,
} from '../../test-utils';
import { sqlGetAllDatabases } from '../sqlGetAllDatabases';
import { sqlGetEntrySyncRecords } from '../sqlGetEntrySyncRecords';
import { sqlUpsertEntries } from '../sqlUpsertEntries';
import { sqlUpsertDatabase } from './sqlUpsertDatabase';

describe('sqlUpsertDatabase', () => {
  beforeEach(() => {
    // Load the workspace the SQL helpers target by default
    setupWorkspaceFixtures(MockFs, {
      loadWorkspaceFiles: false,
      loadWorkspacesConfig: false,
    });

    // Open an in-memory database and create the schema
    setupTestSqlDatabase();

    // Seed the database and one of its entries
    sqlUpsertDatabase(
      {
        id: objectDatabase.id,
        name: objectDatabase.name,
        path: objectDatabase.path,
        icon: '',
      },
      { silent: true },
    );
    sqlUpsertEntries(objectDatabase.id, [objectEntry1SqlRecord], {
      silent: true,
    });
  });

  afterEach(() => {
    cleanupTestSqlDatabase();
    cleanupWorkspaceFixtures();
  });

  it('inserts the database record', () => {
    const databases = sqlGetAllDatabases();

    expect(databases).toEqual([
      {
        id: objectDatabase.id,
        name: objectDatabase.name,
        path: objectDatabase.path,
        icon: '',
      },
    ]);
  });

  it('updates an existing database record', () => {
    // Upsert the database again with changed metadata
    sqlUpsertDatabase(
      {
        id: objectDatabase.id,
        name: 'Renamed',
        path: '/workspace/Renamed',
        icon: 'icon',
      },
      { silent: true },
    );

    expect(sqlGetAllDatabases()).toEqual([
      {
        id: objectDatabase.id,
        name: 'Renamed',
        path: '/workspace/Renamed',
        icon: 'icon',
      },
    ]);
  });

  it('preserves the database entries', () => {
    // Upsert the database again, as a database config update does
    sqlUpsertDatabase(
      {
        id: objectDatabase.id,
        name: objectDatabase.name,
        path: objectDatabase.path,
        icon: 'icon',
      },
      { silent: true },
    );

    // The entries must survive, a replaced database row would
    // cascade delete them.
    expect(sqlGetEntrySyncRecords(objectDatabase.id)).toHaveLength(1);
  });
});
