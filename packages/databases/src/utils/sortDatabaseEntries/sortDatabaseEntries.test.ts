import { describe, expect, it } from 'vitest';
import { objectEntry1 } from '../../test-utils';
import { DatabaseEntry } from '../../types';
import { sortDatabaseEntries } from './sortDatabaseEntries';

// Three entries created a day apart, with a Rating property
// which the middle entry is missing
const oldest: DatabaseEntry = {
  ...objectEntry1,
  id: 'database-entry_oldest',
  title: 'Carrot',
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-03-01T00:00:00.000Z'),
  properties: { Rating: 3 },
};
const middle: DatabaseEntry = {
  ...objectEntry1,
  id: 'database-entry_middle',
  title: 'apple',
  created: new Date('2024-01-02T00:00:00.000Z'),
  lastModified: new Date('2024-02-01T00:00:00.000Z'),
  properties: {},
};
const newest: DatabaseEntry = {
  ...objectEntry1,
  id: 'database-entry_newest',
  title: 'Banana',
  created: new Date('2024-01-03T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
  properties: { Rating: 1 },
};

const entries = [oldest, middle, newest];

describe('sortDatabaseEntries', () => {
  it('sorts by created date, newest first, by default', () => {
    expect(sortDatabaseEntries(entries)).toEqual([newest, middle, oldest]);
  });

  it('sorts by created date ascending', () => {
    expect(sortDatabaseEntries(entries, { direction: 'ascending' })).toEqual([
      oldest,
      middle,
      newest,
    ]);
  });

  it('sorts by the last modified metadata', () => {
    expect(
      sortDatabaseEntries(entries, {
        property: 'last-modified',
        direction: 'descending',
      }),
    ).toEqual([oldest, middle, newest]);
  });

  it('sorts by the title metadata, case insensitively', () => {
    expect(
      sortDatabaseEntries(entries, {
        property: 'title',
        direction: 'ascending',
      }),
    ).toEqual([middle, newest, oldest]);
  });

  it('sorts by a property value', () => {
    expect(
      sortDatabaseEntries(entries, {
        by: 'property',
        property: 'Rating',
        direction: 'ascending',
      }),
    ).toEqual([newest, oldest, middle]);
  });

  it('sorts entries missing the property last in either direction', () => {
    expect(
      sortDatabaseEntries(entries, {
        by: 'property',
        property: 'Rating',
        direction: 'descending',
      }),
    ).toEqual([oldest, newest, middle]);
  });

  it('does not sort property values by a metadata type', () => {
    // The entries have no property named 'title', so sorting by
    // one falls back to the title tiebreaker rather than the
    // title metadata
    expect(
      sortDatabaseEntries(entries, { by: 'property', property: 'title' }),
    ).toEqual([middle, newest, oldest]);
  });

  it('breaks ties on the entry title', () => {
    const tied = entries.map((entry) => ({
      ...entry,
      properties: { Rating: 1 },
    }));

    expect(
      sortDatabaseEntries(tied, { by: 'property', property: 'Rating' }),
    ).toEqual([
      { ...middle, properties: { Rating: 1 } },
      { ...newest, properties: { Rating: 1 } },
      { ...oldest, properties: { Rating: 1 } },
    ]);
  });

  it('does not mutate the given entries', () => {
    const unsorted = [oldest, middle, newest];

    sortDatabaseEntries(unsorted);

    expect(unsorted).toEqual([oldest, middle, newest]);
  });
});
