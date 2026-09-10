import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ItemReferenceAdaptersRegistry } from '../ItemReferenceAdaptersRegistry';
import { ItemReferenceAdapter } from '../types';
import { matchItemReference } from './matchItemReference';

// Claims addresses inside the 'Books' database, marking the
// 'New book' entry as valid but not yet existing.
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

describe('matchItemReference', () => {
  beforeEach(() => {
    ItemReferenceAdaptersRegistry.register(entryAdapter);
    ItemReferenceAdaptersRegistry.register(databaseAdapter);
  });

  afterEach(() => {
    ItemReferenceAdaptersRegistry.clear();
  });

  it('matches references through the claiming adapter', () => {
    expect(matchItemReference('Books/One')).toEqual({
      type: 'database-entry',
      id: 'entry:Books/One',
    });
  });

  it('cascades unclaimed references to later-registered adapters', () => {
    expect(matchItemReference('Books')).toEqual({
      type: 'database',
      id: 'database_books',
    });
  });

  it('matches via the first claiming adapter in registration order', () => {
    // A second adapter that would also claim 'Books' addresses
    ItemReferenceAdaptersRegistry.register({
      type: 'widget',
      serialize: (id) => id,
      match: (reference) =>
        reference.startsWith('Books/')
          ? { type: 'widget', id: `widget:${reference}` }
          : null,
    });

    expect(matchItemReference('Books/One')).toEqual({
      type: 'database-entry',
      id: 'entry:Books/One',
    });
  });

  it('matches valid references to not-yet-existing items with a null ID', () => {
    expect(matchItemReference('Books/New book')).toEqual({
      type: 'database-entry',
      id: null,
    });
  });

  it('matches unclaimed typed entity IDs as their own runtime ID', () => {
    expect(matchItemReference('view_abc-123')).toEqual({
      type: 'view',
      id: 'view_abc-123',
    });
  });

  it('returns null for references nothing recognizes', () => {
    expect(matchItemReference('Unknown/Thing')).toBeNull();
    expect(matchItemReference('unknown')).toBeNull();
    expect(matchItemReference('my_db/Thing')).toBeNull();
  });
});
