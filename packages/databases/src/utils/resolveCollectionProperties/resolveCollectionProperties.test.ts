import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PropertyMap } from '@minddrop/properties';
import {
  cleanup,
  collectionDatabase,
  collectionEntry1,
  referenceEntry1,
  relatedEntry1,
  relatedEntry2,
  setup,
} from '../../test-utils';
import { databaseEntryAddress } from '../databaseEntryAddress';
import { resolveCollectionProperties } from './resolveCollectionProperties';

// Path index containing the referenced fixture entries
const entryIdByPath = new Map([
  [relatedEntry1.path, relatedEntry1.id],
  [relatedEntry2.path, relatedEntry2.id],
  [referenceEntry1.path, referenceEntry1.id],
]);

describe('resolveCollectionProperties', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('resolves collection property addresses to entry IDs', () => {
    const resolved = resolveCollectionProperties(
      serializedProperties(),
      collectionDatabase,
      entryIdByPath,
    );

    expect(resolved.Related).toEqual([relatedEntry1.id, relatedEntry2.id]);
    expect(resolved.References).toEqual([referenceEntry1.id]);
  });

  it('leaves non-collection properties untouched', () => {
    const resolved = resolveCollectionProperties(
      serializedProperties(),
      collectionDatabase,
      entryIdByPath,
    );

    expect(resolved.Title).toBe(collectionEntry1.properties.Title);
  });

  it('drops addresses that do not resolve', () => {
    const resolved = resolveCollectionProperties(
      { ...serializedProperties(), Related: ['old-uuid-value'] },
      collectionDatabase,
      entryIdByPath,
    );

    expect(resolved.Related).toEqual([]);
  });

  it('does not mutate the input properties', () => {
    const properties = serializedProperties();
    const original = { ...properties };

    resolveCollectionProperties(properties, collectionDatabase, entryIdByPath);

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
      databaseEntryAddress(relatedEntry1.path),
      databaseEntryAddress(relatedEntry2.path),
    ],
    References: [databaseEntryAddress(referenceEntry1.path)],
  };
}
