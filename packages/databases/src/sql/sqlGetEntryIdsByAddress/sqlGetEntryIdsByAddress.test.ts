import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { titleFromPath } from '@minddrop/utils';
import {
  cleanup,
  cleanupTestSqlDatabase,
  databases,
  entrySqlRecords,
  seedSqlDatabases,
  seedSqlEntries,
  setup,
  setupTestSqlDatabase,
} from '../../test-utils';
import { resolveEntryAddressKey } from '../../utils';
import { sqlGetEntryIdsByAddress } from './sqlGetEntryIdsByAddress';

describe('sqlGetEntryIdsByAddress', () => {
  beforeEach(() => {
    setup();
    setupTestSqlDatabase();
    seedSqlDatabases();
    seedSqlEntries((record) => record);
  });

  afterEach(async () => {
    cleanupTestSqlDatabase();
    await cleanup();
  });

  it("indexes every indexed entry's ID by its address key", () => {
    const entryIdByAddress = sqlGetEntryIdsByAddress();

    // Expect each fixture record under the address of its database
    const expected = new Map(
      entrySqlRecords.map((record) => [
        resolveEntryAddressKey(
          { title: titleFromPath(record.path) },
          getDatabaseFixture(record.databaseId),
        ),
        record.id,
      ]),
    );

    expect(entryIdByAddress).toEqual(expected);
  });
});

/**
 * Returns the fixture database with the given ID.
 */
function getDatabaseFixture(id: string) {
  const database = databases.find((candidate) => candidate.id === id);

  if (!database) {
    throw new Error(`No fixture database ${id}`);
  }

  return database;
}
