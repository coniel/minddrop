import { afterEach, describe, expect, it } from 'vitest';
import { itemReferenceAdapters } from '../itemReferenceAdapters';
import { ItemReferenceAdapter } from '../types';
import { registerItemReferenceAdapter } from './registerItemReferenceAdapter';

const adapter: ItemReferenceAdapter = {
  type: 'database-entry',
  serialize: (id) => id,
  match: () => null,
};

describe('registerItemReferenceAdapter', () => {
  afterEach(() => {
    itemReferenceAdapters.clear();
  });

  it('registers the adapter under its entity type', () => {
    registerItemReferenceAdapter(adapter);

    expect(itemReferenceAdapters.get('database-entry')).toBe(adapter);
  });

  it('replaces a previously registered adapter for the same type', () => {
    const replacement: ItemReferenceAdapter = { ...adapter };

    registerItemReferenceAdapter(adapter);
    registerItemReferenceAdapter(replacement);

    expect(itemReferenceAdapters.get('database-entry')).toBe(replacement);
  });
});
