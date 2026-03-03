import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabasesStore } from '../DatabasesStore';
import {
  cleanup,
  objectDatabase,
  objectEntry1,
  rootStorageDatabase,
  rootStorageEntry1,
  rootStorageEntry_empty_value,
  setup,
  urlDatabase,
  urlEntry1,
  yamlObjectDatabase,
  yamlObjectEntry1,
} from '../test-utils';
import { getDatabasesFromEntries } from './getDatabasesFromEntries';

describe('getDatabasesFromEntries', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns an empty array if no entry IDs are provided', () => {
    expect(getDatabasesFromEntries([])).toEqual([]);
  });

  it('returns the database for a single entry', () => {
    const result = getDatabasesFromEntries([objectEntry1.id]);

    expect(result).toEqual([objectDatabase]);
  });

  it('returns a unique list of databases when entries belong to the same database', () => {
    // Both entries belong to rootStorageDatabase
    const result = getDatabasesFromEntries([
      rootStorageEntry1.id,
      rootStorageEntry_empty_value.id,
    ]);

    expect(result).toEqual([rootStorageDatabase]);
  });

  it('returns multiple databases when entries belong to different databases', () => {
    const result = getDatabasesFromEntries([
      objectEntry1.id,
      urlEntry1.id,
      yamlObjectEntry1.id,
    ]);

    expect(result).toHaveLength(3);
    expect(result).toContainEqual(objectDatabase);
    expect(result).toContainEqual(urlDatabase);
    expect(result).toContainEqual(yamlObjectDatabase);
  });

  it('skips entries whose database does not exist in the store', () => {
    // Remove the database from the store
    DatabasesStore.remove(objectDatabase.id);

    const result = getDatabasesFromEntries([objectEntry1.id, urlEntry1.id]);

    expect(result).toEqual([urlDatabase]);
  });

  it('skips entry IDs that do not exist in the store', () => {
    const result = getDatabasesFromEntries([objectEntry1.id, 'non-existent']);

    expect(result).toEqual([objectDatabase]);
  });
});
