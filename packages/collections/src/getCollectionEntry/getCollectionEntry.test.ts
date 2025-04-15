import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CollectionEntryNotFoundError } from '../errors';
import { cleanup, itemsEntry1, setup } from '../test-utils';
import { getCollectionEntry } from './getCollectionEntry';

describe('getCollectionEntry', () => {
  beforeEach(() => setup({ loadCollectionEntries: true }));

  afterEach(cleanup);

  it('returns the entry if it exists', () => {
    const entry = getCollectionEntry(itemsEntry1.path);

    expect(entry).toEqual(itemsEntry1);
  });

  it('returns null if the entry does not exist', () => {
    const entry = getCollectionEntry('non-existent-entry');

    expect(entry).toBeNull();
  });

  it('throws if the entry does not exist and throwOnNotFound is true', () => {
    expect(() => getCollectionEntry('non-existent-entry', true)).toThrow(
      CollectionEntryNotFoundError,
    );
  });
});
