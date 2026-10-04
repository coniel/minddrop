import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  objectDatabase,
  objectEntry1,
  rootStorageEntry1,
  setup,
} from '../../test-utils';
import { Entry } from '../../types';
import { resolveEntryReference } from './resolveEntryReference';

describe('resolveEntryReference', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('references an entry with a unique title by its title alone', () => {
    expect(resolveEntryReference(rootStorageEntry1)).toBe(
      rootStorageEntry1.title,
    );
  });

  it('qualifies a title shared by entries in more than one database', () => {
    // objectEntry1's title is shared with entries in other databases
    expect(resolveEntryReference(objectEntry1)).toBe(
      `${objectDatabase.name}/${objectEntry1.title}`,
    );
  });

  it('resolves an entry given by ID', () => {
    expect(resolveEntryReference(rootStorageEntry1.id)).toBe(
      rootStorageEntry1.title,
    );
  });

  it('falls back to the title when the database is missing', () => {
    const orphanedEntry: Entry = {
      ...objectEntry1,
      database: 'database_missing',
    };

    expect(resolveEntryReference(orphanedEntry)).toBe(orphanedEntry.title);
  });
});
