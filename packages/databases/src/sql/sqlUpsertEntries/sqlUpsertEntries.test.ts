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
import { sqlUpsertEntries } from './sqlUpsertEntries';

const {
  collectionDatabase,
  collectionEntry1SqlRecord,
  objectEntry1ContentPropertyRecord,
  relatedEntry1,
} = DatabaseFixtures;

describe('sqlUpsertEntries', () => {
  beforeEach(() => {
    setup();

    // Open an in-memory SQL database
    setupTestSqlDatabase();

    // Seed the entries' database
    sqlUpsertDatabase(collectionDatabase, { silent: true });
  });

  afterEach(async () => {
    cleanupTestSqlDatabase();
    await cleanup();
  });

  it("replaces the entry's references", async () => {
    sqlUpsertEntries(collectionDatabase.id, [collectionEntry1SqlRecord], {
      silent: true,
    });

    // Upsert the entry again, referencing the related entry by wikilink
    // only.
    sqlUpsertEntries(
      collectionDatabase.id,
      [
        {
          ...collectionEntry1SqlRecord,
          properties: [
            {
              ...objectEntry1ContentPropertyRecord,
              value: `[[${relatedEntry1.title}]]`,
            },
          ],
        },
      ],
      { silent: true },
    );

    expect(
      await sqlGetReferencesToEntry(relatedEntry1.id, [relatedEntry1.title]),
    ).toEqual([
      {
        kind: 'wikilink',
        entryId: collectionEntry1SqlRecord.id,
        reference: relatedEntry1.title,
      },
    ]);
  });
});
