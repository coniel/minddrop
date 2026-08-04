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
      id: reference === 'Books/New book.md' ? null : `entry:${reference}`,
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
    expect(resolveItemReference('Books/One.md')).toBe('entry:Books/One.md');
  });

  it('returns null for valid references to not-yet-existing items', () => {
    expect(resolveItemReference('Books/New book.md')).toBeNull();
  });

  it('returns null for references nothing recognizes', () => {
    expect(resolveItemReference('Unknown/Thing.md')).toBeNull();
  });
});
