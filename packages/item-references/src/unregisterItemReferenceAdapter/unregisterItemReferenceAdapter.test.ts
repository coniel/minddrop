import { afterEach, describe, expect, it } from 'vitest';
import { itemReferenceAdapters } from '../itemReferenceAdapters';
import { ItemReferenceAdapter } from '../types';
import { unregisterItemReferenceAdapter } from './unregisterItemReferenceAdapter';

const adapter: ItemReferenceAdapter = {
  type: 'database-entry',
  serialize: (id) => id,
  match: () => null,
};

describe('unregisterItemReferenceAdapter', () => {
  afterEach(() => {
    itemReferenceAdapters.clear();
  });

  it('unregisters the adapter for the entity type', () => {
    itemReferenceAdapters.set(adapter.type, adapter);

    unregisterItemReferenceAdapter('database-entry');

    expect(itemReferenceAdapters.has('database-entry')).toBe(false);
  });
});
