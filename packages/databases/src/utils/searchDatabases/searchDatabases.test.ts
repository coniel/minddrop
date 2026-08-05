import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  objectDatabase,
  rootStorageDatabase,
  setup,
  yamlObjectDatabase,
} from '../../test-utils';
import { searchDatabases } from './searchDatabases';

describe('searchDatabases', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('matches databases by name', () => {
    expect(searchDatabases('Objects')).toEqual([objectDatabase]);
  });

  it('matches databases by entry name, deduping name matches', () => {
    // Matches both the database name and entry name
    expect(searchDatabases('YAML')).toEqual([yamlObjectDatabase]);
  });

  it('filters databases by ID', () => {
    expect(searchDatabases('Storage', [rootStorageDatabase.id])).toEqual([
      rootStorageDatabase,
    ]);
  });

  it('returns an empty array when nothing matches', () => {
    expect(searchDatabases('xyzq')).toEqual([]);
  });
});
