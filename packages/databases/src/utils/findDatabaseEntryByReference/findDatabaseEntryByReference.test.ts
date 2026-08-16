import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  referenceEntry1,
  rootStorageDatabase,
  setup,
} from '../../test-utils';
import { findDatabaseEntryByReference } from './findDatabaseEntryByReference';

describe('findDatabaseEntryByReference', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('finds an entry by its title', () => {
    expect(findDatabaseEntryByReference(referenceEntry1.title)).toEqual(
      referenceEntry1,
    );
  });

  it('finds an entry by its title qualified by its database name', () => {
    // The database is named by its directory, not identified by its ID
    expect(
      findDatabaseEntryByReference(
        `${rootStorageDatabase.name}/${referenceEntry1.title}`,
      ),
    ).toEqual(referenceEntry1);
  });

  it('does not resolve a reference qualified by a database ID', () => {
    expect(
      findDatabaseEntryByReference(
        `${referenceEntry1.database}/${referenceEntry1.title}`,
      ),
    ).toBeNull();
  });

  it('matches case-insensitively', () => {
    expect(
      findDatabaseEntryByReference(referenceEntry1.title.toUpperCase()),
    ).toEqual(referenceEntry1);
  });

  it('returns null when no entry answers to the reference', () => {
    expect(findDatabaseEntryByReference('No such entry')).toBeNull();
  });

  it('returns null when the named database does not exist', () => {
    expect(
      findDatabaseEntryByReference(`Other/${referenceEntry1.title}`),
    ).toBeNull();
  });

  it('returns null for an empty reference', () => {
    expect(findDatabaseEntryByReference('')).toBeNull();
  });
});
