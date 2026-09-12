import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { readEntryMetadata } from '../../readEntryMetadata';
import {
  MockFs,
  cleanup,
  cleanupTestSqlDatabase,
  collectionDatabase,
  collectionEntry1,
  databaseDirPath,
  databaseEntryFilePath,
  databases,
  parentDir,
  referenceEntry1,
  relatedEntry1,
  relatedEntry2,
  rootStorageDatabase,
  setup,
  setupTestSqlDatabase,
} from '../../test-utils';
import { SqlEntryRecord } from '../../types';
import { writeEntryMetadata } from '../../writeEntryMetadata';
import { sqlGetAllDatabases } from '../sqlGetAllDatabases';
import { sqlGetAllEntriesFull } from '../sqlGetAllEntriesFull';
import { initializeDatabasesBackend } from './initializeDatabasesBackend';

const { workspace_1 } = WorkspaceFixtures;

// A file's stat dates, as reset by a rewrite of the entry file
const statDate = new Date('2026-02-02T00:00:00.000Z');
// The entry's real creation date, as held by its sidecar
const sidecarDate = new Date('2020-03-03T00:00:00.000Z');

describe('initializeDatabasesBackend', () => {
  beforeEach(() => {
    setup();

    // Register the in-memory SQL adapter the backend opens its
    // database through.
    setupTestSqlDatabase();
  });

  afterEach(async () => {
    cleanupTestSqlDatabase();
    await cleanup();
  });

  it('populates SQL with the workspace databases and entries', async () => {
    const result = await initializeDatabasesBackend(workspace_1.id, parentDir);

    // A fresh in-memory database always triggers a rebuild
    expect(result.schemaChanged).toBe(true);

    // The database records should be indexed in SQL
    expect(
      sqlGetAllDatabases()
        .map((record) => record.id)
        .sort(),
    ).toEqual(databases.map((database) => database.id).sort());

    // The returned entries should be the indexed SQL records
    expect(result.entries).toEqual(sqlGetAllEntriesFull());
    expect(result.entries.length).toBeGreaterThan(0);
  });

  it('drops databases deleted since the last session from the index', async () => {
    // Index the workspace, as a first launch does
    await initializeDatabasesBackend(workspace_1.id, parentDir);

    expect(indexedRecords(collectionDatabase.id).length).toBeGreaterThan(0);

    // Delete the database directory while the app is closed
    MockFs.removeDir(databaseDirPath(collectionDatabase));

    // Launch again onto the index the first launch left behind
    const result = await initializeDatabasesBackend(workspace_1.id, parentDir);

    // The index is served as is rather than rebuilt from the
    // file system, which would have dropped the database anyway.
    expect(result.schemaChanged).toBe(false);

    // The deleted database is gone from the index
    expect(sqlGetAllDatabases().map((record) => record.id)).not.toContain(
      collectionDatabase.id,
    );

    // As are its entries, which have no database to resolve against
    expect(indexedRecords(collectionDatabase.id)).toEqual([]);
    expect(
      result.entries.filter(
        (record) => record.databaseId === collectionDatabase.id,
      ),
    ).toEqual([]);
  });

  it('resolves collection property addresses to the minted entry IDs', async () => {
    await initializeDatabasesBackend(workspace_1.id, parentDir);

    // Look up the indexed records by path
    const records = indexedRecords(collectionDatabase.id);
    const collectionRecord = recordByPath(records, collectionEntry1.path);
    const related1Record = recordByPath(records, relatedEntry1.path);
    const related2Record = recordByPath(records, relatedEntry2.path);

    // The Related members should reference the minted IDs
    expect(propertyValue(collectionRecord, 'Related')).toEqual([
      related1Record.id,
      related2Record.id,
    ]);
  });

  it('resolves references across databases', async () => {
    await initializeDatabasesBackend(workspace_1.id, parentDir);

    const collectionRecord = recordByPath(
      indexedRecords(collectionDatabase.id),
      collectionEntry1.path,
    );
    const referenceRecord = recordByPath(
      indexedRecords(rootStorageDatabase.id),
      referenceEntry1.path,
    );

    // The References member should reference the minted ID from
    // the other database's batch.
    expect(propertyValue(collectionRecord, 'References')).toEqual([
      referenceRecord.id,
    ]);
  });

  it('drops unresolvable reference values', async () => {
    // Write old-format member values into the entry file
    MockFs.writeTextFile(
      databaseEntryFilePath(collectionEntry1),
      `---
Title: Collection Entry 1
Related:
  - 285cd103-a65f-4f80-a3d7-5d8466c651db
References: []
---`,
    );

    await initializeDatabasesBackend(workspace_1.id, parentDir);

    const collectionRecord = recordByPath(
      indexedRecords(collectionDatabase.id),
      collectionEntry1.path,
    );

    // An emptied multi-value property stores no rows, so the
    // dropped member leaves the property absent from the record.
    expect(propertyValue(collectionRecord, 'Related')).toBeUndefined();
  });

  it('seeds an entry sidecar with its stat derived timestamps', async () => {
    MockFs.setFileStats(databaseEntryFilePath(collectionEntry1), {
      created: statDate,
      lastModified: statDate,
    });

    await initializeDatabasesBackend(workspace_1.id, parentDir);

    const metadata = await readEntryMetadata(
      databaseDirPath(collectionDatabase),
      databaseEntryFilePath(collectionEntry1),
    );

    expect(metadata.created).toEqual(statDate);
    expect(metadata.lastModified).toEqual(statDate);
  });

  it('uses a seeded sidecar rather than re-seeding from stat', async () => {
    await writeEntryMetadata(
      databaseDirPath(collectionDatabase),
      databaseEntryFilePath(collectionEntry1),
      {
        created: sidecarDate,
        lastModified: sidecarDate,
      },
    );

    // Stat reports a rewritten file, as an atomic write leaves behind
    MockFs.setFileStats(databaseEntryFilePath(collectionEntry1), {
      created: statDate,
      lastModified: statDate,
    });

    await initializeDatabasesBackend(workspace_1.id, parentDir);

    // The indexed entry keeps the sidecar's timestamps
    const record = recordByPath(
      indexedRecords(collectionDatabase.id),
      collectionEntry1.path,
    );

    expect(record.created).toBe(sidecarDate.getTime());
    expect(record.lastModified).toBe(sidecarDate.getTime());

    // And the sidecar is left as it was
    const metadata = await readEntryMetadata(
      databaseDirPath(collectionDatabase),
      databaseEntryFilePath(collectionEntry1),
    );

    expect(metadata.created).toEqual(sidecarDate);
  });
});

/**
 * Returns all records indexed in SQL for the given database.
 */
function indexedRecords(databaseId: string): SqlEntryRecord[] {
  return sqlGetAllEntriesFull().filter(
    (record) => record.databaseId === databaseId,
  );
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
