import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  MockFs,
  cleanup,
  collectionDatabase,
  collectionEntry1,
  databaseEntrySqlRecords,
  databases,
  parentDir,
  referenceEntry1,
  relatedEntry1,
  relatedEntry2,
  setup,
} from '../test-utils';
import { SqlEntryRecord } from '../types';
import { backgroundSyncDatabases } from './backgroundSyncDatabases';
import { sqlDeleteEntries } from './sqlDeleteEntries';
import { sqlGetAllDatabases } from './sqlGetAllDatabases';
import { sqlGetEntrySyncRecords } from './sqlGetEntrySyncRecords';
import { sqlUpsertEntries } from './sqlUpsertEntries';

// Mock SQL operations since no database connection is available in tests
vi.mock('@minddrop/sql', () => ({
  Sql: { all: vi.fn(() => []) },
}));
vi.mock('./sqlGetAllDatabases', () => ({ sqlGetAllDatabases: vi.fn() }));
vi.mock('./sqlGetEntrySyncRecords', () => ({
  sqlGetEntrySyncRecords: vi.fn(),
}));
vi.mock('./sqlGetAllEntriesFull', () => ({
  sqlGetAllEntriesFull: vi.fn(() => []),
}));
vi.mock('./sqlDeleteDatabase', () => ({ sqlDeleteDatabase: vi.fn() }));
vi.mock('./sqlDeleteEntries', () => ({ sqlDeleteEntries: vi.fn() }));
vi.mock('./sqlUpsertDatabase', () => ({ sqlUpsertDatabase: vi.fn() }));
vi.mock('./sqlUpsertEntries', () => ({ sqlUpsertEntries: vi.fn() }));
vi.mock('./sqlUpdateEntryMetadata', () => ({
  sqlUpdateEntryMetadata: vi.fn(),
}));

describe('backgroundSyncDatabases', () => {
  beforeEach(() => {
    setup();

    // Return the fixture databases from SQL
    vi.mocked(sqlGetAllDatabases).mockReturnValue(
      databases.map((database) => ({
        id: database.id,
        name: database.name,
        path: database.path,
        icon: database.icon,
      })),
    );

    // Return the fixture entries as existing sync records with a
    // stale timestamp so every entry appears modified
    vi.mocked(sqlGetEntrySyncRecords).mockImplementation((databaseId) =>
      databaseEntrySqlRecords
        .filter((record) => record.databaseId === databaseId)
        .map((record) => ({
          id: record.id,
          path: record.path,
          lastModified: 0,
        })),
    );
  });

  afterEach(cleanup);

  it('resolves references to the existing entry IDs', async () => {
    await backgroundSyncDatabases(parentDir);

    const collectionRecord = recordByPath(
      upsertedRecords(collectionDatabase.id),
      collectionEntry1.path,
    );

    // Members should resolve to the path-matched existing IDs,
    // including the cross-database reference
    expect(propertyValue(collectionRecord, 'Related')).toEqual([
      relatedEntry1.id,
      relatedEntry2.id,
    ]);
    expect(propertyValue(collectionRecord, 'References')).toEqual([
      referenceEntry1.id,
    ]);
  });

  it('keeps entry identities across offline database renames', async () => {
    // The SQL rows carry the database's pre-rename path
    const oldDatabasePath = `${parentDir}/Old Collection`;

    vi.mocked(sqlGetAllDatabases).mockReturnValue(
      databases.map((database) => ({
        id: database.id,
        name: database.name,
        path:
          database.id === collectionDatabase.id
            ? oldDatabasePath
            : database.path,
        icon: database.icon,
      })),
    );

    // Entry sync records carry the pre-rename entry paths
    vi.mocked(sqlGetEntrySyncRecords).mockImplementation((databaseId) =>
      databaseEntrySqlRecords
        .filter((record) => record.databaseId === databaseId)
        .map((record) => ({
          id: record.id,
          path:
            record.databaseId === collectionDatabase.id
              ? record.path.replace(collectionDatabase.path, oldDatabasePath)
              : record.path,
          lastModified: 0,
        })),
    );

    await backgroundSyncDatabases(parentDir);

    // Entries at the renamed paths should keep their existing IDs
    const collectionRecord = recordByPath(
      upsertedRecords(collectionDatabase.id),
      collectionEntry1.path,
    );

    expect(collectionRecord.id).toBe(collectionEntry1.id);
    // No entries should be treated as deleted
    expect(sqlDeleteEntries).not.toHaveBeenCalled();
  });

  it('drops references to entries deleted offline', async () => {
    // Remove a referenced entry's file as if deleted offline
    MockFs.removeFile(relatedEntry2.path);

    await backgroundSyncDatabases(parentDir);

    const collectionRecord = recordByPath(
      upsertedRecords(collectionDatabase.id),
      collectionEntry1.path,
    );

    // The deleted member should be dropped from the references
    expect(propertyValue(collectionRecord, 'Related')).toEqual([
      relatedEntry1.id,
    ]);
    // The deleted entry should be removed from SQL
    expect(sqlDeleteEntries).toHaveBeenCalledWith(
      collectionDatabase.id,
      [relatedEntry2.id],
      { silent: true },
    );
  });
});

/**
 * Returns all records upserted for the given database.
 */
function upsertedRecords(databaseId: string): SqlEntryRecord[] {
  return vi
    .mocked(sqlUpsertEntries)
    .mock.calls.filter(([id]) => id === databaseId)
    .flatMap(([, records]) => records);
}

/**
 * Returns the record with the given path.
 */
function recordByPath(records: SqlEntryRecord[], path: string): SqlEntryRecord {
  return records.find((record) => record.path === path)!;
}

/**
 * Returns the value of the named property on a record.
 */
function propertyValue(record: SqlEntryRecord, name: string) {
  return record.properties.find((property) => property.name === name)?.value;
}
