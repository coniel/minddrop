import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ItemReferenceAdaptersRegistry } from '../ItemReferenceAdaptersRegistry';
import { ItemReferenceAdapter } from '../types';
import { serializeItemReference } from './serializeItemReference';

// Maps entry IDs to fake path addresses, dropping the 'missing' entry
const entryAdapter: ItemReferenceAdapter = {
  type: 'database-entry',
  serialize: (id, workspaceId) => {
    if (id === 'database-entry_missing') {
      return null;
    }

    // Name the workspace serialized in when one is given
    return workspaceId ? `${workspaceId}:Books/${id}` : `Books/${id}`;
  },
  match: () => null,
};

describe('serializeItemReference', () => {
  beforeEach(() => {
    ItemReferenceAdaptersRegistry.register(entryAdapter);
  });

  afterEach(() => {
    ItemReferenceAdaptersRegistry.clear();
  });

  it('serializes the ID through its type adapter', () => {
    expect(serializeItemReference('database-entry_one')).toBe(
      'Books/database-entry_one',
    );
  });

  it('serializes the ID in the given workspace', () => {
    expect(serializeItemReference('database-entry_one', 'workspace-2')).toBe(
      'workspace-2:Books/database-entry_one',
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
