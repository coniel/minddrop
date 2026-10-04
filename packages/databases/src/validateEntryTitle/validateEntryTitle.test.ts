import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { EntriesStore } from '../EntriesStore';
import { cleanup, objectEntry1, setup } from '../test-utils';
import { Entry } from '../types';
import { validateEntryTitle } from './validateEntryTitle';

// A sibling entry in the same database as objectEntry1
const siblingEntry: Entry = {
  ...objectEntry1,
  id: 'database-entry_sibling-entry',
  path: `${objectEntry1.path.replace('Test Entry.md', 'Sibling Entry.md')}`,
  title: 'Sibling Entry',
};

describe('validateEntryTitle', () => {
  beforeEach(() => {
    setup();

    // Add a sibling entry to the entries store
    EntriesStore.set(siblingEntry);
  });

  afterEach(cleanup);

  it('accepts an available title', () => {
    expect(validateEntryTitle(objectEntry1, 'Available Title')).toBeUndefined();
  });

  it('accepts an empty title', () => {
    // Empty titles are committed as renames to an untitled title
    expect(validateEntryTitle(objectEntry1, '')).toBeUndefined();
    expect(validateEntryTitle(objectEntry1, '   ')).toBeUndefined();
  });

  it('accepts the entry current title', () => {
    expect(
      validateEntryTitle(objectEntry1, objectEntry1.title),
    ).toBeUndefined();
  });

  it('rejects titles containing path separators', () => {
    expect(validateEntryTitle(objectEntry1, 'Foo/Bar')).toBe(
      'databases.entries.errors.titleInvalidCharacters',
    );
    expect(validateEntryTitle(objectEntry1, 'Foo\\Bar')).toBe(
      'databases.entries.errors.titleInvalidCharacters',
    );
  });

  it('rejects titles taken by another entry in the database', () => {
    expect(validateEntryTitle(objectEntry1, siblingEntry.title)).toBe(
      'databases.entries.errors.titleConflict',
    );
  });
});
