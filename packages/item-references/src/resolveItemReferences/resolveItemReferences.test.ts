import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { itemReferenceAdapters } from '../itemReferenceAdapters';
import { ItemReferenceAdapter } from '../types';
import { resolveItemReferences } from './resolveItemReferences';

// Claims addresses inside the 'Books' database, marking the
// 'New book' entry as valid but not yet existing
const entryAdapter: ItemReferenceAdapter = {
  type: 'database-entry',
  serialize: (id) => id,
  match: (reference) => {
    if (!reference.startsWith('Books/')) {
      return null;
    }

    return {
      type: 'database-entry',
      id: reference === 'Books/New book' ? null : `entry:${reference}`,
    };
  },
};

// Claims bare database names
const databaseAdapter: ItemReferenceAdapter = {
  type: 'database',
  serialize: (id) => id,
  match: (reference) =>
    reference === 'Books' ? { type: 'database', id: 'database_books' } : null,
};

describe('resolveItemReferences', () => {
  beforeEach(() => {
    itemReferenceAdapters.set(entryAdapter.type, entryAdapter);
    itemReferenceAdapters.set(databaseAdapter.type, databaseAdapter);
  });

  afterEach(() => {
    itemReferenceAdapters.clear();
  });

  it('resolves references preserving input order across adapters', () => {
    expect(
      resolveItemReferences([
        'Books',
        'view_abc-123',
        'Books/One',
        'Books/Two',
      ]),
    ).toEqual([
      'database_books',
      'view_abc-123',
      'entry:Books/One',
      'entry:Books/Two',
    ]);
  });

  it('drops references nothing recognizes', () => {
    expect(
      resolveItemReferences(['Unknown/Thing', 'unknown', 'my_db/Thing']),
    ).toEqual([]);
  });

  it('drops valid references to not-yet-existing items by default', () => {
    expect(resolveItemReferences(['Books/One', 'Books/New book'])).toEqual([
      'entry:Books/One',
    ]);
  });

  it('keeps valid references to not-yet-existing items when requested', () => {
    expect(
      resolveItemReferences(['Books/One', 'Books/New book'], {
        keepMissing: true,
      }),
    ).toEqual(['entry:Books/One', 'Books/New book']);
  });
});
