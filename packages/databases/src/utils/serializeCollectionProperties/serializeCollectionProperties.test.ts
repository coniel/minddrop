import { afterEach, beforeEach, describe, expect, it } from 'vitest';
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
import { serializeCollectionProperties } from './serializeCollectionProperties';

describe('serializeCollectionProperties', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('converts collection property values to addresses', () => {
    const serialized = serializeCollectionProperties(
      collectionEntry1.properties,
      collectionDatabase,
    );

    expect(serialized.Related).toEqual([
      databaseEntryAddress(relatedEntry1),
      databaseEntryAddress(relatedEntry2),
    ]);
    expect(serialized.References).toEqual([
      databaseEntryAddress(referenceEntry1),
    ]);
  });

  it('leaves non-collection properties untouched', () => {
    const serialized = serializeCollectionProperties(
      collectionEntry1.properties,
      collectionDatabase,
    );

    expect(serialized.Title).toBe(collectionEntry1.properties.Title);
  });

  it('drops IDs that do not resolve', () => {
    const serialized = serializeCollectionProperties(
      { ...collectionEntry1.properties, Related: ['database-entry_missing'] },
      collectionDatabase,
    );

    expect(serialized.Related).toEqual([]);
  });

  it('does not mutate the input properties', () => {
    serializeCollectionProperties(
      collectionEntry1.properties,
      collectionDatabase,
    );

    expect(collectionEntry1.properties.Related).toEqual([
      relatedEntry1.id,
      relatedEntry2.id,
    ]);
  });
});
