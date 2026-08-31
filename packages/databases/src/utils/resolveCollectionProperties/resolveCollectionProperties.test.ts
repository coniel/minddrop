import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PropertyMap } from '@minddrop/properties';
import {
  cleanup,
  collectionDatabase,
  collectionEntry1,
  referenceEntry1,
  relatedEntry1,
  relatedEntry2,
  rootStorageDatabase,
  setup,
} from '../../test-utils';
import { databaseEntryAddress } from '../databaseEntryAddress';
import { resolveCollectionProperties } from './resolveCollectionProperties';

// Address index containing the referenced fixture entries, keyed
// lowercased as the resolve path expects
const entryIdByAddress = new Map([
  [
    databaseEntryAddress(relatedEntry1, collectionDatabase).toLowerCase(),
    relatedEntry1.id,
  ],
  [
    databaseEntryAddress(relatedEntry2, collectionDatabase).toLowerCase(),
    relatedEntry2.id,
  ],
  [
    databaseEntryAddress(referenceEntry1, rootStorageDatabase).toLowerCase(),
    referenceEntry1.id,
  ],
]);

describe('resolveCollectionProperties', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('resolves collection property addresses to entry IDs', () => {
    const resolved = resolveCollectionProperties(
      serializedProperties(),
      collectionDatabase,
      entryIdByAddress,
    );

    expect(resolved.Related).toEqual([relatedEntry1.id, relatedEntry2.id]);
    expect(resolved.References).toEqual([referenceEntry1.id]);
  });

  it('leaves non-collection properties untouched', () => {
    const resolved = resolveCollectionProperties(
      serializedProperties(),
      collectionDatabase,
      entryIdByAddress,
    );

    expect(resolved.Title).toBe(collectionEntry1.properties.Title);
  });

  it('drops addresses that do not resolve', () => {
    const resolved = resolveCollectionProperties(
      { ...serializedProperties(), Related: ['old-uuid-value'] },
      collectionDatabase,
      entryIdByAddress,
    );

    expect(resolved.Related).toEqual([]);
  });

  it('does not mutate the input properties', () => {
    const properties = serializedProperties();
    const original = { ...properties };

    resolveCollectionProperties(
      properties,
      collectionDatabase,
      entryIdByAddress,
    );

    expect(properties).toEqual(original);
  });
});

/**
 * Returns collectionEntry1's properties in serialized (address) form.
 */
function serializedProperties(): PropertyMap {
  return {
    ...collectionEntry1.properties,
    Related: [
      databaseEntryAddress(relatedEntry1, collectionDatabase),
      databaseEntryAddress(relatedEntry2, collectionDatabase),
    ],
    References: [databaseEntryAddress(referenceEntry1, rootStorageDatabase)],
  };
}
