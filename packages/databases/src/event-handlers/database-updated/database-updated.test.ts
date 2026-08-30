import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { sqlGetAllDatabases, sqlUpsertDatabase } from '../../sql';
import {
  cleanup,
  cleanupTestSqlDatabase,
  objectDatabase,
  parentDir,
  setup,
  setupTestSqlDatabase,
  urlDatabase,
} from '../../test-utils';
import { onUpdateDatabase } from './database-updated';

// The database with updated metadata
const updatedDatabase = {
  ...objectDatabase,
  name: 'Renamed Objects',
  path: `${parentDir}/Renamed Objects`,
  icon: 'content-icon:star:red',
};

describe('onUpdateDatabase', () => {
  beforeEach(() => {
    setup();

    // Open an in-memory SQL database
    setupTestSqlDatabase();

    // Seed the database's existing SQL record
    sqlUpsertDatabase(
      {
        id: objectDatabase.id,
        name: objectDatabase.name,
        path: objectDatabase.path,
        icon: objectDatabase.icon,
      },
      { silent: true },
    );
  });

  afterEach(() => {
    cleanupTestSqlDatabase();
    cleanup();
  });

  it('syncs the updated metadata to SQL', () => {
    // Call the handler with the updated database
    onUpdateDatabase({ original: objectDatabase, updated: updatedDatabase });

    // The SQL record should carry the updated metadata
    expect(sqlGetAllDatabases()).toEqual([
      {
        id: updatedDatabase.id,
        name: updatedDatabase.name,
        path: updatedDatabase.path,
        icon: updatedDatabase.icon,
      },
    ]);
  });

  it('leaves other databases untouched', () => {
    // Seed a second database
    sqlUpsertDatabase(
      {
        id: urlDatabase.id,
        name: urlDatabase.name,
        path: urlDatabase.path,
        icon: urlDatabase.icon,
      },
      { silent: true },
    );

    // Call the handler with the updated database
    onUpdateDatabase({ original: objectDatabase, updated: updatedDatabase });

    // The other database's record should be unchanged
    expect(sqlGetAllDatabases()).toContainEqual({
      id: urlDatabase.id,
      name: urlDatabase.name,
      path: urlDatabase.path,
      icon: urlDatabase.icon,
    });
  });
});
