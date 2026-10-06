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
import { sqlRenameProperty } from './sqlRenameProperty';

const {
  collectionDatabase,
  collectionEntry1SqlRecord,
  objectDatabase,
  objectEntry1SqlRecord,
  referenceEntry1,
  referencesPropertyName,
  relatedEntry1,
  relatedPropertyName,
} = DatabaseFixtures;

describe('sqlRenameProperty', () => {
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

  it('renames the property in the entry references', async () => {
    sqlRenameProperty(collectionDatabase.id, relatedPropertyName, 'Links');

    expect(await sqlGetReferencesToEntry(relatedEntry1.id, [])).toEqual([
      {
        kind: 'property',
        entryId: collectionEntry1SqlRecord.id,
        propertyName: 'Links',
        targetEntryId: relatedEntry1.id,
      },
    ]);
  });

  it('leaves the references of other properties unchanged', async () => {
    sqlRenameProperty(collectionDatabase.id, relatedPropertyName, 'Links');

    expect(await sqlGetReferencesToEntry(referenceEntry1.id, [])).toEqual([
      {
        kind: 'property',
        entryId: collectionEntry1SqlRecord.id,
        propertyName: referencesPropertyName,
        targetEntryId: referenceEntry1.id,
      },
    ]);
  });

  it("leaves the references of other databases' entries unchanged", async () => {
    // Index an object database entry with a property of the same name
    sqlUpsertDatabase(objectDatabase, { silent: true });
    sqlUpsertEntries(
      objectDatabase.id,
      [
        {
          ...objectEntry1SqlRecord,
          properties: [collectionEntry1SqlRecord.properties[1]],
        },
      ],
      { silent: true },
    );

    sqlRenameProperty(collectionDatabase.id, relatedPropertyName, 'Links');

    expect(await sqlGetReferencesToEntry(relatedEntry1.id, [])).toContainEqual({
      kind: 'property',
      entryId: objectEntry1SqlRecord.id,
      propertyName: relatedPropertyName,
      targetEntryId: relatedEntry1.id,
    });
  });
});
