import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Collections } from '@minddrop/collections';
import {
  cleanup,
  collectionDatabase,
  collectionEntry1,
  objectDatabase,
  setup,
} from '../../test-utils';
import { virtualCollectionId, virtualCollectionName } from '../../utils';
import { onRemoveProperty } from './property-removed';

vi.mock('../../sql', () => ({
  sqlReindexDatabaseEntries: vi.fn(),
}));

describe('onRemoveProperty', () => {
  beforeEach(() => {
    setup();

    // Create virtual collections for the collection entry
    Collections.createVirtual(
      virtualCollectionId(collectionEntry1.id, 'Related'),
      virtualCollectionName(
        collectionDatabase.name,
        collectionEntry1.title,
        'Related',
      ),
      collectionEntry1.properties.Related as string[],
    );
    Collections.createVirtual(
      virtualCollectionId(collectionEntry1.id, 'References'),
      virtualCollectionName(
        collectionDatabase.name,
        collectionEntry1.title,
        'References',
      ),
      collectionEntry1.properties.References as string[],
    );
  });

  afterEach(cleanup);

  it('does nothing if the property is not a collection type', async () => {
    // Remove a non-collection property
    await onRemoveProperty({
      database: objectDatabase,
      property: { type: 'text', name: 'Content' },
    });

    // Virtual collections should be unchanged
    const related = Collections.Store.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );
    expect(related).not.toBeNull();
  });

  it('deletes virtual collections for all entries', async () => {
    // Find the Related property schema
    const property = collectionDatabase.properties.find(
      (p) => p.name === 'Related',
    )!;

    await onRemoveProperty({ database: collectionDatabase, property });

    // The 'Related' virtual collection should be deleted
    const related = Collections.Store.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );
    expect(related).toBeNull();

    // The 'References' virtual collection should still exist
    const references = Collections.Store.get(
      virtualCollectionId(collectionEntry1.id, 'References'),
    );
    expect(references).not.toBeNull();
  });
});
