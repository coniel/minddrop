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
import { sqlQueryEntries } from './sqlQueryEntries';
import { sqlUpsertDatabase } from './sqlUpsertDatabase';
import { sqlUpsertEntries } from './sqlUpsertEntries';

const databaseId = objectDatabase.id;

// Entry with low values and a Done status
const alphaEntry: SqlEntryRecord = {
  ...objectEntry1SqlRecord,
  id: 'database-entry_alpha',
  path: `${objectDatabase.path}/Alpha.md`,
  title: 'Alpha',
  created: 1000,
  lastModified: 1000,
  properties: [
    { name: 'Content', type: 'formatted-text', value: 'apple pie' },
    { name: 'Amount', type: 'number', value: 5 },
    { name: 'Due', type: 'date', value: 1000 },
    { name: 'Done', type: 'toggle', value: true },
    { name: 'Status', type: 'select', value: ['Done'] },
  ],
};

// Entry with high values and an In progress status
const betaEntry: SqlEntryRecord = {
  ...objectEntry1SqlRecord,
  id: 'database-entry_beta',
  path: `${objectDatabase.path}/Beta.md`,
  title: 'Beta',
  created: 2000,
  lastModified: 2000,
  properties: [
    { name: 'Content', type: 'formatted-text', value: 'banana bread' },
    { name: 'Amount', type: 'number', value: 10 },
    { name: 'Due', type: 'date', value: 3000 },
    { name: 'Done', type: 'toggle', value: false },
    { name: 'Status', type: 'select', value: ['In progress'] },
  ],
};

// Entry with no property values at all
const gammaEntry: SqlEntryRecord = {
  ...objectEntry1SqlRecord,
  id: 'database-entry_gamma',
  path: `${objectDatabase.path}/Gamma.md`,
  title: 'Gamma',
  created: 3000,
  lastModified: 3000,
  properties: [],
};

// Entry in a different database, used to verify scoping
const otherDatabaseEntry: SqlEntryRecord = {
  ...objectEntry1SqlRecord,
  id: 'database-entry_delta',
  databaseId: urlDatabase.id,
  path: `${urlDatabase.path}/Delta.md`,
  title: 'Delta',
  created: 1000,
  lastModified: 1000,
  properties: [{ name: 'Content', type: 'formatted-text', value: 'apple pie' }],
};

const filterGroup = (
  filters: EntryFilterGroup['filters'],
  combinator: 'and' | 'or' = 'and',
): EntryFilterGroup => ({ combinator, filters });

describe('sqlQueryEntries', () => {
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
    sqlUpsertEntries(databaseId, [alphaEntry, betaEntry, gammaEntry], {
      silent: true,
    });
    sqlUpsertEntries(urlDatabase.id, [otherDatabaseEntry], { silent: true });
  });

  afterAll(() => {
    Sql.close();
  });

  it('returns all database entries sorted by title when no filter is given', async () => {
    const result = await sqlQueryEntries(databaseId, null, []);

    expect(result).toEqual([alphaEntry.id, betaEntry.id, gammaEntry.id]);
  });

  it('scopes results to the given database', async () => {
    const result = await sqlQueryEntries(
      databaseId,
      filterGroup([
        {
          property: 'Content',
          propertyType: 'formatted-text',
          operator: 'text-contains',
          value: 'apple',
        },
      ]),
      [],
    );

    expect(result).toEqual([alphaEntry.id]);
  });

  it('matches text comparisons case-insensitively', async () => {
    const result = await sqlQueryEntries(
      databaseId,
      filterGroup([
        {
          property: 'Content',
          propertyType: 'formatted-text',
          operator: 'text-equals',
          value: 'APPLE PIE',
        },
      ]),
      [],
    );

    expect(result).toEqual([alphaEntry.id]);
  });

  it('matches number comparisons', async () => {
    const result = await sqlQueryEntries(
      databaseId,
      filterGroup([
        {
          property: 'Amount',
          propertyType: 'number',
          operator: 'number-greater-than',
          value: 7,
        },
      ]),
      [],
    );

    expect(result).toEqual([betaEntry.id]);
  });

  it('includes entries missing the property in negative comparisons', async () => {
    const result = await sqlQueryEntries(
      databaseId,
      filterGroup([
        {
          property: 'Amount',
          propertyType: 'number',
          operator: 'number-not-equals',
          value: 5,
        },
      ]),
      [],
    );

    expect(result).toEqual([betaEntry.id, gammaEntry.id]);
  });

  it('matches date range comparisons on the value_integer column', async () => {
    const result = await sqlQueryEntries(
      databaseId,
      filterGroup([
        {
          property: 'Due',
          propertyType: 'date',
          operator: 'number-greater-than-or-equal',
          value: 2000,
        },
      ]),
      [],
    );

    expect(result).toEqual([betaEntry.id]);
  });

  it('matches unset toggles as not true', async () => {
    const result = await sqlQueryEntries(
      databaseId,
      filterGroup([
        {
          property: 'Done',
          propertyType: 'toggle',
          operator: 'number-not-equals',
          value: 1,
        },
      ]),
      [],
    );

    expect(result).toEqual([betaEntry.id, gammaEntry.id]);
  });

  it('matches select membership', async () => {
    const result = await sqlQueryEntries(
      databaseId,
      filterGroup([
        {
          property: 'Status',
          propertyType: 'select',
          operator: 'has-value',
          value: 'Done',
        },
      ]),
      [],
    );

    expect(result).toEqual([alphaEntry.id]);
  });

  it('matches emptiness on multi-value properties', async () => {
    const result = await sqlQueryEntries(
      databaseId,
      filterGroup([
        {
          property: 'Status',
          propertyType: 'select',
          operator: 'is-empty',
        },
      ]),
      [],
    );

    expect(result).toEqual([gammaEntry.id]);
  });

  it('matches emptiness on scalar properties', async () => {
    const result = await sqlQueryEntries(
      databaseId,
      filterGroup([
        {
          property: 'Content',
          propertyType: 'formatted-text',
          operator: 'is-empty',
        },
      ]),
      [],
    );

    expect(result).toEqual([gammaEntry.id]);
  });

  it('matches title pseudo-property comparisons', async () => {
    const result = await sqlQueryEntries(
      databaseId,
      filterGroup([
        {
          property: 'Title',
          propertyType: 'title',
          operator: 'text-starts-with',
          value: 'Al',
        },
      ]),
      [],
    );

    expect(result).toEqual([alphaEntry.id]);
  });

  it('matches created pseudo-property comparisons', async () => {
    const result = await sqlQueryEntries(
      databaseId,
      filterGroup([
        {
          property: 'Created',
          propertyType: 'created',
          operator: 'number-less-than',
          value: 2500,
        },
      ]),
      [],
    );

    expect(result).toEqual([alphaEntry.id, betaEntry.id]);
  });

  it('combines nested groups with mixed combinators', async () => {
    const result = await sqlQueryEntries(
      databaseId,
      filterGroup(
        [
          {
            property: 'Content',
            propertyType: 'formatted-text',
            operator: 'text-contains',
            value: 'apple',
          },
          filterGroup([
            {
              property: 'Amount',
              propertyType: 'number',
              operator: 'number-greater-than-or-equal',
              value: 10,
            },
            {
              property: 'Due',
              propertyType: 'date',
              operator: 'number-greater-than-or-equal',
              value: 2000,
            },
          ]),
        ],
        'or',
      ),
      [],
    );

    expect(result).toEqual([alphaEntry.id, betaEntry.id]);
  });

  it('sorts by property values with missing values last', async () => {
    const ascending = await sqlQueryEntries(databaseId, null, [
      { property: 'Amount', propertyType: 'number', direction: 'ascending' },
    ]);
    const descending = await sqlQueryEntries(databaseId, null, [
      { property: 'Amount', propertyType: 'number', direction: 'descending' },
    ]);

    expect(ascending).toEqual([alphaEntry.id, betaEntry.id, gammaEntry.id]);
    expect(descending).toEqual([betaEntry.id, alphaEntry.id, gammaEntry.id]);
  });

  it('sorts by pseudo-properties', async () => {
    const result = await sqlQueryEntries(databaseId, null, [
      { property: 'Created', propertyType: 'created', direction: 'descending' },
    ]);

    expect(result).toEqual([gammaEntry.id, betaEntry.id, alphaEntry.id]);
  });

  it('limits the result count', async () => {
    const result = await sqlQueryEntries(databaseId, null, [], { limit: 2 });

    expect(result).toEqual([alphaEntry.id, betaEntry.id]);
  });
});
