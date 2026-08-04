import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { itemReferenceAdapters } from '../itemReferenceAdapters';
import { ItemReferenceAdapter } from '../types';
import { serializeItemReferences } from './serializeItemReferences';

// Maps entry IDs to fake path addresses, dropping the 'missing' entry
const entryAdapter: ItemReferenceAdapter = {
  type: 'database-entry',
  serialize: (id) =>
    id === 'database-entry_missing' ? null : `Books/${id}.md`,
  match: () => null,
};

describe('serializeItemReferences', () => {
  beforeEach(() => {
    itemReferenceAdapters.set(entryAdapter.type, entryAdapter);
  });

  afterEach(() => {
    itemReferenceAdapters.clear();
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
      'Books/database-entry_one.md',
      'widget_two',
      'Books/database-entry_two.md',
    ]);
  });

  it('drops IDs the adapter cannot serialize', () => {
    expect(
      serializeItemReferences([
        'database-entry_one',
        'database-entry_missing',
        'database-entry_two',
      ]),
    ).toEqual(['Books/database-entry_one.md', 'Books/database-entry_two.md']);
  });
});
