import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { itemReferenceAdapters } from '../itemReferenceAdapters';
import { ItemReferenceAdapter } from '../types';
import { serializeItemReference } from './serializeItemReference';

// Maps entry IDs to fake path addresses, dropping the 'missing' entry
const entryAdapter: ItemReferenceAdapter = {
  type: 'database-entry',
  serialize: (id) => (id === 'database-entry_missing' ? null : `Books/${id}`),
  match: () => null,
};

describe('serializeItemReference', () => {
  beforeEach(() => {
    itemReferenceAdapters.set(entryAdapter.type, entryAdapter);
  });

  afterEach(() => {
    itemReferenceAdapters.clear();
  });

  it('serializes the ID through its type adapter', () => {
    expect(serializeItemReference('database-entry_one')).toBe(
      'Books/database-entry_one',
    );
  });

  it('passes IDs without a registered adapter through unchanged', () => {
    expect(serializeItemReference('widget_one')).toBe('widget_one');
    expect(serializeItemReference('untyped')).toBe('untyped');
  });

  it('returns null when the adapter cannot serialize the ID', () => {
    expect(serializeItemReference('database-entry_missing')).toBeNull();
  });
});
