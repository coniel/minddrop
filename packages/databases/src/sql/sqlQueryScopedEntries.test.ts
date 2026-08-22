import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Sql } from '@minddrop/sql';
import {
  objectDatabase,
  objectEntry1SqlRecord,
  urlDatabase,
} from '../test-utils';
import { createTestSqlAdapter } from '../test-utils/createTestSqlAdapter';
import { EntryFilterGroup, SqlEntryRecord } from '../types';
import { SCHEMA_SQL } from './schema';
import { sqlCountScopedEntries } from './sqlCountScopedEntries';
import { sqlQueryScopedEntries } from './sqlQueryScopedEntries';
import { sqlUpsertDatabase } from './sqlUpsertDatabase';
import { sqlUpsertEntries } from './sqlUpsertEntries';

// Entry in the first database with a tag value
const alphaEntry: SqlEntryRecord = {
  ...objectEntry1SqlRecord,
  id: 'database-entry_alpha',
  path: `${objectDatabase.path}/Alpha.md`,
  title: 'Alpha',
  created: 1000,
  lastModified: 1000,
  properties: [{ name: 'Tag', type: 'text', value: 'idea' }],
};

// Entry in the first database without a tag value
const betaEntry: SqlEntryRecord = {
  ...objectEntry1SqlRecord,
  id: 'database-entry_beta',
  path: `${objectDatabase.path}/Beta.md`,
  title: 'Beta',
  created: 3000,
  lastModified: 3000,
  properties: [],
};

// Entry in the second database with a matching tag value
const gammaEntry: SqlEntryRecord = {
  ...objectEntry1SqlRecord,
  id: 'database-entry_gamma',
  databaseId: urlDatabase.id,
  path: `${urlDatabase.path}/Gamma.md`,
  title: 'Gamma',
  created: 2000,
  lastModified: 2000,
  properties: [{ name: 'Tag', type: 'text', value: 'idea' }],
};

// A filter group matching entries whose Tag equals 'idea'
const tagFilter: EntryFilterGroup = {
  combinator: 'and',
  filters: [
    {
      property: 'Tag',
      propertyType: 'text',
      operator: 'text-equals',
      value: 'idea',
    },
  ],
};

describe('sqlQueryScopedEntries', () => {
  beforeAll(() => {
    // Open an in-memory database and create the schema
    Sql.registerAdapter(createTestSqlAdapter());
    Sql.initialize();
    Sql.exec(SCHEMA_SQL);

    // Seed the database rows required by the entries foreign key
    sqlUpsertDatabase(
      {
        id: objectDatabase.id,
        name: objectDatabase.name,
        path: objectDatabase.path,
        icon: '',
      },
      { silent: true },
    );
    sqlUpsertDatabase(
      {
        id: urlDatabase.id,
        name: urlDatabase.name,
        path: urlDatabase.path,
        icon: '',
      },
      { silent: true },
    );

    // Seed the test entries
    sqlUpsertEntries(objectDatabase.id, [alphaEntry, betaEntry], {
      silent: true,
    });
    sqlUpsertEntries(urlDatabase.id, [gammaEntry], { silent: true });
  });

  afterAll(() => {
    Sql.close();
  });

  it('returns no entries when no scopes are given', async () => {
    const result = await sqlQueryScopedEntries([], []);

    expect(result).toEqual([]);
  });

  it('returns entries from all scopes sorted together', async () => {
    const result = await sqlQueryScopedEntries(
      [
        { databaseId: objectDatabase.id, filter: null },
        { databaseId: urlDatabase.id, filter: null },
      ],
      [
        {
          property: 'created',
          propertyType: 'created',
          direction: 'descending',
        },
      ],
    );

    // Cross-database sort: beta (3000), gamma (2000), alpha (1000)
    expect(result).toEqual([betaEntry.id, gammaEntry.id, alphaEntry.id]);
  });

  it('applies each scope filter to its own database only', async () => {
    const result = await sqlQueryScopedEntries(
      [
        { databaseId: objectDatabase.id, filter: tagFilter },
        { databaseId: urlDatabase.id, filter: null },
      ],
      [],
    );

    // Beta has no tag so only matches through the unfiltered scope
    expect(result).toEqual([alphaEntry.id, gammaEntry.id]);
  });

  it('caps the result count at the limit', async () => {
    const result = await sqlQueryScopedEntries(
      [
        { databaseId: objectDatabase.id, filter: null },
        { databaseId: urlDatabase.id, filter: null },
      ],
      [],
      { limit: 2 },
    );

    expect(result).toEqual([alphaEntry.id, betaEntry.id]);
  });

  describe('sqlCountScopedEntries', () => {
    it('returns zero when no scopes are given', async () => {
      const result = await sqlCountScopedEntries([]);

      expect(result).toBe(0);
    });

    it('counts entries matching the scopes', async () => {
      const result = await sqlCountScopedEntries([
        { databaseId: objectDatabase.id, filter: tagFilter },
        { databaseId: urlDatabase.id, filter: tagFilter },
      ]);

      expect(result).toBe(2);
    });
  });
});
