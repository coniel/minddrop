import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { itemReferenceAdapters } from '../itemReferenceAdapters';
import { ItemReferenceAdapter } from '../types';
import { resolveItemReference } from './resolveItemReference';

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

describe('resolveItemReference', () => {
  beforeEach(() => {
    itemReferenceAdapters.set(entryAdapter.type, entryAdapter);
  });

  afterEach(() => {
    itemReferenceAdapters.clear();
  });

  it('resolves the reference into its runtime ID', () => {
    expect(resolveItemReference('Books/One')).toBe('entry:Books/One');
  });

  it('returns null for valid references to not-yet-existing items', () => {
    expect(resolveItemReference('Books/New book')).toBeNull();
  });

  it('returns null for references nothing recognizes', () => {
    expect(resolveItemReference('Unknown/Thing')).toBeNull();
  });
});
