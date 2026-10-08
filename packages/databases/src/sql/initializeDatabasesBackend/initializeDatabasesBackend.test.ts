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
  databases,
  entryFilePath,
  getRecordByPath,
  parentDir,
  referenceEntry1,
  relatedEntry1,
  relatedEntry2,
  resolveRecordPropertyValue,
  rootStorageDatabase,
  setup,
  setupTestSqlDatabase,
} from '../../test-utils';
import { SqlEntryRecord } from '../../types';
import { writeEntryMetadata } from '../../writeEntryMetadata';
import { sqlGetAllDatabases } from '../sqlGetAllDatabases';
import { sqlGetEntriesFull } from '../sqlGetEntriesFull';
import { sqlGetVersion } from '../sqlGetVersion';
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
    expect(result.entries).toEqual(sqlGetEntriesFull());
    expect(result.entries.length).toBeGreaterThan(0);
  });

  it('drops databases deleted since the last session from the index', async () => {
    // Index the workspace, as a first launch does
    await initializeDatabasesBackend(workspace_1.id, parentDir);

    expect(indexedRecords(collectionDatabase.id).length).toBeGreaterThan(0);

    // Delete the database directory while the app is closed
    MockFs.removeDir(databaseDirPath(collectionDatabase), { recursive: true });

    // Launch again onto the index the first launch left behind
    const result = await initializeDatabasesBackend(workspace_1.id, parentDir);

    // Expect the index to be served as is. A rebuild from the file
    // system would have dropped the database anyway.
    expect(result.schemaChanged).toBe(false);

    // The deleted database is gone from the index
    expect(sqlGetAllDatabases().map((record) => record.id)).not.toContain(
      collectionDatabase.id,
    );

    // Expect its entries to be gone too. They have no database to
    // resolve against.
    expect(indexedRecords(collectionDatabase.id)).toEqual([]);
    expect(
      result.entries.filter(
        (record) => record.databaseId === collectionDatabase.id,
      ),
    ).toEqual([]);
  });

  // Pins Issue 55: A database removed on disk while the app is closed leaves
  // the index version unchanged. Remove .fails once fixed.
  it.fails(
    'advances the index version when it drops databases deleted since the last session',
    async () => {
      // Index the workspace, as a first launch does
      await initializeDatabasesBackend(workspace_1.id, parentDir);

      // Read the index version at the end of the session
      const persistedVersion = sqlGetVersion();

      // Delete the database directory while the app is closed
      MockFs.removeDir(databaseDirPath(collectionDatabase), {
        recursive: true,
      });

      // Launch again onto the index the first launch left behind
      await initializeDatabasesBackend(workspace_1.id, parentDir);

      // Expect the index version to advance when databases are dropped
      expect(sqlGetVersion()).not.toBe(persistedVersion);
    },
  );

  it('resolves collection property addresses to the minted entry IDs', async () => {
    await initializeDatabasesBackend(workspace_1.id, parentDir);

    // Look up the indexed records by path
    const records = indexedRecords(collectionDatabase.id);
    const collectionRecord = getRecordByPath(records, collectionEntry1.path);
    const related1Record = getRecordByPath(records, relatedEntry1.path);
    const related2Record = getRecordByPath(records, relatedEntry2.path);

    // The Related members should reference the minted IDs
    expect(resolveRecordPropertyValue(collectionRecord, 'Related')).toEqual([
      related1Record.id,
      related2Record.id,
    ]);
  });

  it('resolves references across databases', async () => {
    await initializeDatabasesBackend(workspace_1.id, parentDir);

    const collectionRecord = getRecordByPath(
      indexedRecords(collectionDatabase.id),
      collectionEntry1.path,
    );
    const referenceRecord = getRecordByPath(
      indexedRecords(rootStorageDatabase.id),
      referenceEntry1.path,
    );

    // The References member should reference the minted ID from
    // the other database's batch.
    expect(resolveRecordPropertyValue(collectionRecord, 'References')).toEqual([
      referenceRecord.id,
    ]);
  });

  it('drops unresolvable reference values', async () => {
    // Write old-format member values into the entry file
    MockFs.writeTextFile(
      entryFilePath(collectionEntry1),
      `---
Title: Collection Entry 1
Related:
  - 285cd103-a65f-4f80-a3d7-5d8466c651db
References: []
---`,
    );

    await initializeDatabasesBackend(workspace_1.id, parentDir);

    const collectionRecord = getRecordByPath(
      indexedRecords(collectionDatabase.id),
      collectionEntry1.path,
    );

    // An emptied multi-value property stores no rows, so the
    // dropped member leaves the property absent from the record.
    expect(
      resolveRecordPropertyValue(collectionRecord, 'Related'),
    ).toBeUndefined();
  });

  it('seeds an entry sidecar with its stat derived timestamps', async () => {
    MockFs.setFileStats(entryFilePath(collectionEntry1), {
      created: statDate,
      lastModified: statDate,
    });

    await initializeDatabasesBackend(workspace_1.id, parentDir);

    const metadata = await readEntryMetadata(
      databaseDirPath(collectionDatabase),
      entryFilePath(collectionEntry1),
    );

    expect(metadata.created).toEqual(statDate);
    expect(metadata.lastModified).toEqual(statDate);
  });

  it('uses a seeded sidecar rather than re-seeding from stat', async () => {
    await writeEntryMetadata(
      databaseDirPath(collectionDatabase),
      entryFilePath(collectionEntry1),
      {
        created: sidecarDate,
        lastModified: sidecarDate,
      },
    );

    // Stat reports a rewritten file, as an atomic write leaves behind
    MockFs.setFileStats(entryFilePath(collectionEntry1), {
      created: statDate,
      lastModified: statDate,
    });

    await initializeDatabasesBackend(workspace_1.id, parentDir);

    // The indexed entry keeps the sidecar's timestamps
    const record = getRecordByPath(
      indexedRecords(collectionDatabase.id),
      collectionEntry1.path,
    );

    expect(record.created).toBe(sidecarDate.getTime());
    expect(record.lastModified).toBe(sidecarDate.getTime());

    // And the sidecar is left as it was
    const metadata = await readEntryMetadata(
      databaseDirPath(collectionDatabase),
      entryFilePath(collectionEntry1),
    );

    expect(metadata.created).toEqual(sidecarDate);
  });
});

/**
 * Returns all records indexed in SQL for the given database.
 */
function indexedRecords(databaseId: string): SqlEntryRecord[] {
  return sqlGetEntriesFull().filter(
    (record) => record.databaseId === databaseId,
  );
}
