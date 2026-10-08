import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  cleanupTestSqlDatabase,
  entrySqlRecords,
  objectEntry1SqlRecord,
  seedSqlDatabases,
  seedSqlEntries,
  setup,
  setupTestSqlDatabase,
  urlEntry1SqlRecord,
} from '../../test-utils';
import { sqlGetEntriesFull } from './sqlGetEntriesFull';

describe('sqlGetEntriesFull', () => {
  beforeEach(() => {
    setup();
    setupTestSqlDatabase();

    // Index the fixture databases and entries
    seedSqlDatabases();
    seedSqlEntries((record) => record);
  });

  afterEach(async () => {
    cleanupTestSqlDatabase();
    await cleanup();
  });

  it('returns every entry when given no IDs', () => {
    expect(
      sqlGetEntriesFull()
        .map((record) => record.id)
        .sort(),
    ).toEqual(entrySqlRecords.map((record) => record.id).sort());
  });

  it('returns only the entries with the given IDs, with their properties', () => {
    const records = sqlGetEntriesFull([objectEntry1SqlRecord.id]);

    expect(records).toEqual([
      {
        ...objectEntry1SqlRecord,
        properties: expect.arrayContaining(objectEntry1SqlRecord.properties),
      },
    ]);
  });

  it('returns no entries for an empty list of IDs', () => {
    expect(sqlGetEntriesFull([])).toEqual([]);
  });

  it('returns entries from every chunk of a split ID list', () => {
    // Pad the list so that the two real IDs fall in different queries
    const padding = Array.from({ length: 10000 }, (_, index) => `${index}`);

    const records = sqlGetEntriesFull([
      objectEntry1SqlRecord.id,
      ...padding,
      urlEntry1SqlRecord.id,
    ]);

    expect(records.map((record) => record.id).sort()).toEqual(
      [objectEntry1SqlRecord.id, urlEntry1SqlRecord.id].sort(),
    );
  });
});
