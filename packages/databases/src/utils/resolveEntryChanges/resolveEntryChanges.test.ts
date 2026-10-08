import { describe, expect, it } from 'vitest';
import {
  createEntryFileChange,
  objectDatabase,
  objectEntry1,
  urlDatabase,
  urlEntry1,
} from '../../test-utils';
import { resolveEntryChanges } from './resolveEntryChanges';

const entryChange = createEntryFileChange(objectDatabase.id, objectEntry1.path);
const metadataChange = createEntryFileChange(
  objectDatabase.id,
  objectEntry1.path,
  'metadata',
);

describe('resolveEntryChanges', () => {
  it('resolves repeated changes to an entry to one', () => {
    expect(resolveEntryChanges([entryChange, { ...entryChange }])).toEqual([
      entryChange,
    ]);
  });

  it("keeps an entry's sidecar change over its file change", () => {
    expect(resolveEntryChanges([entryChange, metadataChange])).toEqual([
      metadataChange,
    ]);
    expect(resolveEntryChanges([metadataChange, entryChange])).toEqual([
      metadataChange,
    ]);
  });

  it('keeps the entries in the order they first appear', () => {
    const otherEntryChange = createEntryFileChange(
      urlDatabase.id,
      urlEntry1.path,
    );

    expect(
      resolveEntryChanges([entryChange, otherEntryChange, metadataChange]),
    ).toEqual([metadataChange, otherEntryChange]);
  });

  it('keeps changes to entries at the same path in different databases apart', () => {
    const otherDatabaseChange = createEntryFileChange(
      urlDatabase.id,
      objectEntry1.path,
    );

    expect(resolveEntryChanges([entryChange, otherDatabaseChange])).toEqual([
      entryChange,
      otherDatabaseChange,
    ]);
  });
});
