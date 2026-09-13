import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ItemReferenceAdaptersRegistry } from '../ItemReferenceAdaptersRegistry';
import { ItemReferenceAdapter } from '../types';
import { resolveItemReference } from './resolveItemReference';

// Claims addresses inside the 'Books' database, marking the
// 'New book' entry as valid but not yet existing.
const entryAdapter: ItemReferenceAdapter = {
  type: 'database-entry',
  serialize: (id) => id,
  match: (reference, workspaceId) => {
    if (!reference.startsWith('Books/')) {
      return null;
    }

    // Name the workspace matched in when one is given
    const prefix = workspaceId ? `${workspaceId}:entry` : 'entry';

    return {
      type: 'database-entry',
      id: reference === 'Books/New book' ? null : `${prefix}:${reference}`,
    };
  },
};

describe('resolveItemReference', () => {
  beforeEach(() => {
    ItemReferenceAdaptersRegistry.register(entryAdapter);
  });

  afterEach(() => {
    ItemReferenceAdaptersRegistry.clear();
  });

  it('resolves the reference into its runtime ID', () => {
    expect(resolveItemReference('Books/One')).toBe('entry:Books/One');
  });

  it('resolves the reference in the given workspace', () => {
    expect(resolveItemReference('Books/One', 'workspace-2')).toBe(
      'workspace-2:entry:Books/One',
    );
  });

  it('returns null for valid references to not-yet-existing items', () => {
    expect(resolveItemReference('Books/New book')).toBeNull();
  });

  it('returns null for references nothing recognizes', () => {
    expect(resolveItemReference('Unknown/Thing')).toBeNull();
  });
});
