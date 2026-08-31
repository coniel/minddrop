import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  collectionDatabase,
  databaseEntries,
  objectDatabase,
  objectEntry1,
  setup,
} from '../test-utils';
import { getAllDatabaseEntries } from './getAllDatabaseEntries';

describe('getAllDatabaseEntries', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("returns the named database's entries", () => {
    const entries = getAllDatabaseEntries(objectDatabase.id);

    expect(entries).toContainEqual(objectEntry1);

    // Entries of other databases are excluded
    expect(entries.every((entry) => entry.database === objectDatabase.id)).toBe(
      true,
    );
  });

  it('returns every entry when no database is named', () => {
    const entries = getAllDatabaseEntries();

    expect(entries).toHaveLength(databaseEntries.length);

    // Entries from more than one database are included
    expect(
      entries.some((entry) => entry.database === collectionDatabase.id),
    ).toBe(true);
  });

  it('returns an empty array for a database with no entries', () => {
    expect(getAllDatabaseEntries('database_missing')).toEqual([]);
  });
});
