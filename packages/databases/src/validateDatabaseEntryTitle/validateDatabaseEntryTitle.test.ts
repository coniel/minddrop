import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { cleanup, objectEntry1, setup } from '../test-utils';
import { DatabaseEntry } from '../types';
import { validateDatabaseEntryTitle } from './validateDatabaseEntryTitle';

// A sibling entry in the same database as objectEntry1
const siblingEntry: DatabaseEntry = {
  ...objectEntry1,
  id: 'Objects/Sibling Entry.md',
  path: `${objectEntry1.path.replace('Test Entry.md', 'Sibling Entry.md')}`,
  title: 'Sibling Entry',
};

describe('validateDatabaseEntryTitle', () => {
  beforeEach(() => {
    setup();

    // Add a sibling entry to the entries store
    DatabaseEntriesStore.set(siblingEntry);
  });

  afterEach(cleanup);

  it('accepts an available title', () => {
    expect(
      validateDatabaseEntryTitle(objectEntry1, 'Available Title'),
    ).toBeUndefined();
  });

  it('accepts an empty title', () => {
    // Empty titles are committed as renames to an untitled title
    expect(validateDatabaseEntryTitle(objectEntry1, '')).toBeUndefined();
    expect(validateDatabaseEntryTitle(objectEntry1, '   ')).toBeUndefined();
  });

  it('accepts the entry current title', () => {
    expect(
      validateDatabaseEntryTitle(objectEntry1, objectEntry1.title),
    ).toBeUndefined();
  });

  it('rejects titles containing path separators', () => {
    expect(validateDatabaseEntryTitle(objectEntry1, 'Foo/Bar')).toBe(
      'databases.entries.errors.titleInvalidCharacters',
    );
    expect(validateDatabaseEntryTitle(objectEntry1, 'Foo\\Bar')).toBe(
      'databases.entries.errors.titleInvalidCharacters',
    );
  });

  it('rejects titles taken by another entry in the database', () => {
    expect(validateDatabaseEntryTitle(objectEntry1, siblingEntry.title)).toBe(
      'databases.entries.errors.titleConflict',
    );
  });
});
