import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Collections } from '@minddrop/collections';
import { cleanup, objectDatabase, objectEntry1, setup } from '../../test-utils';
import { virtualCollectionId, virtualCollectionName } from '../../utils';
import { onAddProperty } from './property-added';

vi.mock('../../sql', () => ({
  sqlReindexDatabaseEntries: vi.fn(),
}));

describe('onAddProperty', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('does nothing if the property is not a collection type', () => {
    // Add a non-collection property
    onAddProperty({
      database: objectDatabase,
      property: { type: 'text', name: 'Notes' },
    });

    // No virtual collections should be created
    const allCollections = Collections.Store.getAllArray();
    const virtualCollections = allCollections.filter((c) => c.virtual);
    expect(virtualCollections).toHaveLength(0);
  });

  it('creates virtual collections for all existing entries', () => {
    // Add a collection property
    const property = { type: 'collection' as const, name: 'Tags' };
    const updated = {
      ...objectDatabase,
      properties: [...objectDatabase.properties, property],
    };

    onAddProperty({ database: updated, property });

    // Should create a virtual collection for the existing entry
    const collection = Collections.Store.get(
      virtualCollectionId(objectEntry1.id, 'Tags'),
    );
    expect(collection).not.toBeNull();
    expect(collection!.virtual).toBe(true);
    expect(collection!.name).toBe(
      virtualCollectionName(updated.name, objectEntry1.title, 'Tags'),
    );
    expect(collection!.entries).toEqual([]);
  });
});
