import { describe, expect, it } from 'vitest';
import { objectDatabase, objectEntry1, urlDatabase } from '../../test-utils';
import { EntryFileChange } from '../../types';
import { mergeEntryFileChanges } from './mergeEntryFileChanges';

const entryChange: EntryFileChange = {
  databaseId: objectDatabase.id,
  path: objectEntry1.path,
  file: 'entry',
};

const metadataChange: EntryFileChange = { ...entryChange, file: 'metadata' };

describe('mergeEntryFileChanges', () => {
  it('merges repeated changes to an entry into one', () => {
    expect(mergeEntryFileChanges([entryChange, { ...entryChange }])).toEqual([
      entryChange,
    ]);
  });

  it("keeps an entry's sidecar change over its file change", () => {
    expect(mergeEntryFileChanges([entryChange, metadataChange])).toEqual([
      metadataChange,
    ]);
    expect(mergeEntryFileChanges([metadataChange, entryChange])).toEqual([
      metadataChange,
    ]);
  });

  it('keeps changes to entries at the same path in different databases apart', () => {
    const otherDatabaseChange = { ...entryChange, databaseId: urlDatabase.id };

    expect(mergeEntryFileChanges([entryChange, otherDatabaseChange])).toEqual([
      entryChange,
      otherDatabaseChange,
    ]);
  });
});
