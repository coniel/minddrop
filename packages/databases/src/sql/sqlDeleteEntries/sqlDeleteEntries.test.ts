import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  DatabaseFixtures,
  cleanup,
  cleanupTestSqlDatabase,
  setup,
  setupTestSqlDatabase,
} from '../../test-utils';
import { sqlGetReferencesToEntry } from '../sqlGetReferencesToEntry';
import { sqlUpsertDatabase } from '../sqlUpsertDatabase';
import { sqlUpsertEntries } from '../sqlUpsertEntries';
import { sqlDeleteEntries } from './sqlDeleteEntries';

const { collectionDatabase, collectionEntry1SqlRecord, relatedEntry1 } =
  DatabaseFixtures;

describe('sqlDeleteEntries', () => {
  beforeEach(() => {
    setup();

    // Open an in-memory SQL database
    setupTestSqlDatabase();

    // Seed the database and its entry
    sqlUpsertDatabase(collectionDatabase, { silent: true });
    sqlUpsertEntries(collectionDatabase.id, [collectionEntry1SqlRecord], {
      silent: true,
    });
  });

  afterEach(async () => {
    cleanupTestSqlDatabase();
    await cleanup();
  });

  it("removes the entries' references", async () => {
    sqlDeleteEntries(collectionDatabase.id, [collectionEntry1SqlRecord.id], {
      silent: true,
    });

    expect(await sqlGetReferencesToEntry(relatedEntry1.id, [])).toEqual([]);
  });
});
