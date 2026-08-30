import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  sqlGetAllEntriesFull,
  sqlUpsertDatabase,
  sqlUpsertEntries,
} from '../../sql';
import {
  cleanup,
  cleanupTestSqlDatabase,
  objectDatabase,
  objectEntry1,
  objectEntry1SqlRecord,
  setup,
  setupTestSqlDatabase,
  urlDatabase,
  urlEntry1,
  urlEntry1SqlRecord,
} from '../../test-utils';
import { DatabaseEntryMetadata } from '../../types';
import { onUpdateEntryMetadata } from './entry-metadata-updated';

// The updated metadata to sync
const entryMetadata: DatabaseEntryMetadata = {
  embeddedViewConfigs: {
    'card:Tasks': { options: {}, data: {} },
  },
};

describe('onUpdateEntryMetadata', () => {
  beforeEach(() => {
    setup();

    // Open an in-memory SQL database
    setupTestSqlDatabase();

    // Seed the entries' databases and existing SQL records
    sqlUpsertDatabase(
      {
        id: objectDatabase.id,
        name: objectDatabase.name,
        path: objectDatabase.path,
        icon: objectDatabase.icon,
      },
      { silent: true },
    );
    sqlUpsertDatabase(
      {
        id: urlDatabase.id,
        name: urlDatabase.name,
        path: urlDatabase.path,
        icon: urlDatabase.icon,
      },
      { silent: true },
    );
    sqlUpsertEntries(objectDatabase.id, [objectEntry1SqlRecord], {
      silent: true,
    });
    sqlUpsertEntries(urlDatabase.id, [urlEntry1SqlRecord], { silent: true });
  });

  afterEach(() => {
    cleanupTestSqlDatabase();
    cleanup();
  });

  it('syncs the updated metadata to SQL', () => {
    // Call the handler with the updated metadata
    onUpdateEntryMetadata({
      entryId: objectEntry1.id,
      databaseId: objectDatabase.id,
      metadata: entryMetadata,
    });

    // The SQL record's metadata column should carry the update
    const record = sqlGetAllEntriesFull().find(
      (entry) => entry.id === objectEntry1.id,
    );

    expect(JSON.parse(record!.metadata)).toEqual(entryMetadata);
  });

  it("leaves other entries' metadata untouched", () => {
    // Call the handler with the updated metadata
    onUpdateEntryMetadata({
      entryId: objectEntry1.id,
      databaseId: objectDatabase.id,
      metadata: entryMetadata,
    });

    // The other entry's metadata should be unchanged
    const record = sqlGetAllEntriesFull().find(
      (entry) => entry.id === urlEntry1.id,
    );

    expect(record?.metadata).toBe(urlEntry1SqlRecord.metadata);
  });
});
