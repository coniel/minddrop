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
} from '../../test-utils';
import { onUpdateEntry } from './entry-updated';

// The entry with an updated title and property value
const updatedEntry = {
  ...objectEntry1,
  title: 'Renamed Entry',
  properties: {
    ...objectEntry1.properties,
    Content: 'Updated content',
  },
};

describe('onUpdateEntry', () => {
  beforeEach(() => {
    setup();

    // Open an in-memory SQL database
    setupTestSqlDatabase();

    // Seed the entry's database and existing SQL record
    sqlUpsertDatabase(
      {
        id: objectDatabase.id,
        name: objectDatabase.name,
        path: objectDatabase.path,
        icon: objectDatabase.icon,
      },
      { silent: true },
    );
    sqlUpsertEntries(objectDatabase.id, [objectEntry1SqlRecord], {
      silent: true,
    });
  });

  afterEach(() => {
    cleanupTestSqlDatabase();
    cleanup();
  });

  it('syncs the updated entry to SQL', () => {
    // Call the handler with the updated entry
    onUpdateEntry({ original: objectEntry1, updated: updatedEntry });

    // The SQL record should carry the updated title
    const record = sqlGetAllEntriesFull().find(
      (entry) => entry.id === objectEntry1.id,
    );

    expect(record?.title).toBe(updatedEntry.title);
  });

  it('syncs the updated property values to SQL', () => {
    // Call the handler with the updated entry
    onUpdateEntry({ original: objectEntry1, updated: updatedEntry });

    // The SQL record's property should carry the updated value
    const record = sqlGetAllEntriesFull().find(
      (entry) => entry.id === objectEntry1.id,
    );
    const contentProperty = record?.properties.find(
      (property) => property.name === 'Content',
    );

    expect(contentProperty?.value).toBe('Updated content');
  });
});
