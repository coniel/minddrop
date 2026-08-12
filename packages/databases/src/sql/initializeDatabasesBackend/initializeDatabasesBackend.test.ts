import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  MockFs,
  cleanup,
  collectionDatabase,
  collectionEntry1,
  parentDir,
  referenceEntry1,
  relatedEntry1,
  relatedEntry2,
  rootStorageDatabase,
  setup,
} from '../../test-utils';
import { SqlEntryRecord } from '../../types';
import { sqlUpsertEntries } from '../sqlUpsertEntries';
import { initializeDatabasesBackend } from './initializeDatabasesBackend';

// Mock SQL operations since no database connection is available in tests
vi.mock('@minddrop/sql', () => ({
  Sql: {
    open: vi.fn(async () => ({ schemaChanged: true })),
    resolveConfigPath: () => '/mock-config',
  },
}));
vi.mock('../sqlUpsertDatabase', () => ({ sqlUpsertDatabase: vi.fn() }));
vi.mock('../sqlUpsertEntries', () => ({ sqlUpsertEntries: vi.fn() }));
vi.mock('../sqlGetAllEntriesFull', () => ({
  sqlGetAllEntriesFull: vi.fn(() => []),
}));

describe('initializeDatabasesBackend', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('resolves collection property addresses to the minted entry IDs', async () => {
    await initializeDatabasesBackend('workspace-1', parentDir);

    // Look up the upserted records by path
    const records = upsertedRecords(collectionDatabase.id);
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
    await initializeDatabasesBackend('workspace-1', parentDir);

    const collectionRecord = recordByPath(
      upsertedRecords(collectionDatabase.id),
      collectionEntry1.path,
    );
    const referenceRecord = recordByPath(
      upsertedRecords(rootStorageDatabase.id),
      referenceEntry1.path,
    );

    // The References member should reference the minted ID from
    // the other database's batch
    expect(propertyValue(collectionRecord, 'References')).toEqual([
      referenceRecord.id,
    ]);
  });

  it('drops unresolvable reference values', async () => {
    // Write old-format member values into the entry file
    MockFs.writeTextFile(
      collectionEntry1.path,
      `---
Title: Collection Entry 1
Related:
  - 285cd103-a65f-4f80-a3d7-5d8466c651db
References: []
---`,
    );

    await initializeDatabasesBackend('workspace-1', parentDir);

    const collectionRecord = recordByPath(
      upsertedRecords(collectionDatabase.id),
      collectionEntry1.path,
    );

    expect(propertyValue(collectionRecord, 'Related')).toEqual([]);
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
