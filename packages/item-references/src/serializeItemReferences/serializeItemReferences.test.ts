import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ItemReferenceAdaptersRegistry } from '../ItemReferenceAdaptersRegistry';
import { ItemReferenceAdapter } from '../types';
import { serializeItemReferences } from './serializeItemReferences';

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

describe('serializeItemReferences', () => {
  beforeEach(() => {
    ItemReferenceAdaptersRegistry.register(entryAdapter);
  });

  afterEach(() => {
    ItemReferenceAdaptersRegistry.clear();
  });

  it('serializes IDs preserving input order across mixed types', () => {
    expect(
      serializeItemReferences([
        'widget_one',
        'database-entry_one',
        'widget_two',
        'database-entry_two',
      ]),
    ).toEqual([
      'widget_one',
      'Books/database-entry_one',
      'widget_two',
      'Books/database-entry_two',
    ]);
  });

  it('serializes the IDs in the given workspace', () => {
    expect(
      serializeItemReferences(['database-entry_one'], 'workspace-2'),
    ).toEqual(['workspace-2:Books/database-entry_one']);
  });

  it('drops IDs the adapter cannot serialize', () => {
    expect(
      serializeItemReferences([
        'database-entry_one',
        'database-entry_missing',
        'database-entry_two',
      ]),
    ).toEqual(['Books/database-entry_one', 'Books/database-entry_two']);
  });
});
