import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import {
  sqlGetAllDatabases,
  sqlGetEntrySyncRecords,
  sqlUpsertDatabase,
} from '../../sql';
import {
  cleanup,
  cleanupTestSqlDatabase,
  objectDatabase,
  objectEntry1,
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

  afterEach(async () => {
    cleanupTestSqlDatabase();
    await cleanup();
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

  it("syncs the entries' paths when the serializer changed", () => {
    // Repath the entry as the serializer conversion does before
    // dispatching
    const newPath = `${objectDatabase.path}/${objectEntry1.title}.json`;

    DatabaseEntriesStore.update(objectEntry1.id, { path: newPath });

    onUpdateDatabase({
      original: objectDatabase,
      updated: { ...objectDatabase, entrySerializer: 'json' },
    });

    // The entry's SQL record should carry the new path
    expect(sqlGetEntrySyncRecords(objectDatabase.id)).toContainEqual(
      expect.objectContaining({ id: objectEntry1.id, path: newPath }),
    );
  });

  it("syncs the entries' paths when crossing the entry storage boundary", () => {
    // Repath the entry as the storage change does before dispatching
    const newPath = `${objectDatabase.path}/${objectEntry1.title}/${objectEntry1.title}.md`;

    DatabaseEntriesStore.update(objectEntry1.id, { path: newPath });

    onUpdateDatabase({
      original: objectDatabase,
      updated: { ...objectDatabase, propertyFileStorage: 'entry' },
    });

    // The entry's SQL record should carry the new path
    expect(sqlGetEntrySyncRecords(objectDatabase.id)).toContainEqual(
      expect.objectContaining({ id: objectEntry1.id, path: newPath }),
    );
  });

  it('does not sync entries when the update left their files in place', () => {
    onUpdateDatabase({ original: objectDatabase, updated: updatedDatabase });

    // No entry records should have been written
    expect(sqlGetEntrySyncRecords(objectDatabase.id)).toEqual([]);
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
