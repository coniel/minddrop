import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanupWorkspaceFixtures,
  setupWorkspaceFixtures,
} from '@minddrop/workspaces/test-utils';
import {
  DatabaseFixtures,
  MockFs,
  cleanupTestSqlDatabase,
  setupTestSqlDatabase,
} from '../../test-utils';
import { SqlEntryRecord } from '../../types';
import { sqlUpsertDatabase } from '../sqlUpsertDatabase';
import { sqlUpsertEntries } from '../sqlUpsertEntries';
import { sqlGetEntryShortPropertyValues } from './sqlGetEntryShortPropertyValues';

const {
  collectionEntry1SqlRecord,
  objectDatabase,
  objectEntry1SqlRecord,
  referenceEntry1,
  urlDatabase,
} = DatabaseFixtures;

// A collection property referencing an entry
const referencesProperty = collectionEntry1SqlRecord.properties.find(
  (property) => property.name === 'References',
)!;

// Entry with scalar, multi-value, collection and long text values
const bookEntry: SqlEntryRecord = {
  ...objectEntry1SqlRecord,
  id: 'database-entry_book',
  path: 'Book.md',
  properties: [
    { name: 'Content', type: 'content', value: 'A long body' },
    { name: 'Notes', type: 'text', value: 'Some notes' },
    { name: 'Source', type: 'url', value: 'https://example.com' },
    { name: 'Status', type: 'select', value: ['Reading', 'Owned'] },
    { name: 'Pages', type: 'number', value: 300 },
    referencesProperty,
  ],
};

// Entry with a single scalar value
const filmEntry: SqlEntryRecord = {
  ...objectEntry1SqlRecord,
  id: 'database-entry_film',
  path: 'Film.md',
  properties: [{ name: 'Source', type: 'url', value: 'https://film.com' }],
};

// Entry in another database
const otherDatabaseEntry: SqlEntryRecord = {
  ...objectEntry1SqlRecord,
  id: 'database-entry_other',
  databaseId: urlDatabase.id,
  path: 'Other.md',
  properties: [{ name: 'Source', type: 'url', value: 'https://other.com' }],
};

describe('sqlGetEntryShortPropertyValues', () => {
  beforeEach(() => {
    // Load the workspace the SQL helpers target by default
    setupWorkspaceFixtures(MockFs, {
      loadWorkspaceFiles: false,
      loadWorkspacesConfig: false,
    });

    // Open an in-memory database and seed the entries
    setupTestSqlDatabase();
    sqlUpsertDatabase(objectDatabase, { silent: true });
    sqlUpsertDatabase(urlDatabase, { silent: true });
    sqlUpsertEntries(objectDatabase.id, [bookEntry, filmEntry], {
      silent: true,
    });
    sqlUpsertEntries(urlDatabase.id, [otherDatabaseEntry], { silent: true });
  });

  afterEach(() => {
    cleanupTestSqlDatabase();
    cleanupWorkspaceFixtures();
  });

  it("returns every entry's short property values", () => {
    const values = sqlGetEntryShortPropertyValues();

    expect(values.get(bookEntry.id)).toEqual(
      expect.arrayContaining(['Owned', 'Reading', 'https://example.com']),
    );
    expect(values.get(filmEntry.id)).toEqual(['https://film.com']);
    expect(values.get(otherDatabaseEntry.id)).toEqual(['https://other.com']);
  });

  it('leaves out text, content and non-text values', () => {
    const values = sqlGetEntryShortPropertyValues();

    expect(values.get(bookEntry.id)).not.toContain('A long body');
    expect(values.get(bookEntry.id)).not.toContain('Some notes');
    expect(values.get(bookEntry.id)).toHaveLength(4);
  });

  it('includes collection references', () => {
    const values = sqlGetEntryShortPropertyValues();

    expect(values.get(bookEntry.id)).toContain(referenceEntry1.id);
  });

  it('reads only the given entries', () => {
    const values = sqlGetEntryShortPropertyValues({
      entryIds: [filmEntry.id, otherDatabaseEntry.id],
    });

    expect([...values.keys()].sort()).toEqual(
      [filmEntry.id, otherDatabaseEntry.id].sort(),
    );
  });

  it('reads only the entries of the given database', () => {
    const values = sqlGetEntryShortPropertyValues({
      databaseId: urlDatabase.id,
    });

    expect([...values.keys()]).toEqual([otherDatabaseEntry.id]);
  });

  it('reads nothing for an empty list of entries', () => {
    expect(sqlGetEntryShortPropertyValues({ entryIds: [] }).size).toBe(0);
  });
});
