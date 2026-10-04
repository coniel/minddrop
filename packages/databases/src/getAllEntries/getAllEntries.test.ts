import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import {
  cleanup,
  collectionDatabase,
  entries,
  objectDatabase,
  objectEntry1,
  setup,
} from '../test-utils';
import { getAllEntries } from './getAllEntries';

const { workspace_2 } = WorkspaceFixtures;

describe('getAllEntries', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("returns the named database's entries", () => {
    const result = getAllEntries(objectDatabase.id);

    expect(result).toContainEqual(objectEntry1);

    // Entries of other databases are excluded
    expect(result.every((entry) => entry.database === objectDatabase.id)).toBe(
      true,
    );
  });

  it('returns every entry when no database is named', () => {
    const result = getAllEntries();

    expect(result).toHaveLength(entries.length);

    // Entries from more than one database are included
    expect(
      result.some((entry) => entry.database === collectionDatabase.id),
    ).toBe(true);
  });

  it('returns an empty array for a database with no entries', () => {
    expect(getAllEntries('database_missing')).toEqual([]);
  });

  it('returns the entries of the given workspace', () => {
    expect(getAllEntries(undefined, workspace_2.id)).toEqual([]);
  });
});
