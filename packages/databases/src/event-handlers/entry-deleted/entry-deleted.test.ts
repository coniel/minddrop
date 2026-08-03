import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Collections } from '@minddrop/collections';
import {
  cleanup,
  collectionDatabase,
  collectionEntry1,
  objectEntry1,
  relatedEntry1,
  relatedEntry2,
  setup,
} from '../../test-utils';
import { virtualCollectionId, virtualCollectionName } from '../../utils';
import { onDeleteEntry } from './entry-deleted';

vi.mock('../../sql', () => ({
  sqlDeleteEntries: vi.fn(),
}));

describe('onDeleteEntry', () => {
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

  it('removes the entry from collections referencing it', async () => {
    // Delete an entry referenced by collectionEntry1's Related collection
    await onDeleteEntry(relatedEntry1);

    const collection = Collections.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );

    expect(collection.entries).toEqual([relatedEntry2.id]);
  });

  it('does nothing if the database has no collection properties', async () => {
    // Call the handler with an entry from a database without collection properties
    await onDeleteEntry(objectEntry1);

    // Virtual collections should still exist
    expect(
      Collections.Store.get(
        virtualCollectionId(collectionEntry1.id, 'Related'),
      ),
    ).not.toBeNull();
  });

  it('deletes virtual collections for the entry', async () => {
    // Call the handler
    await onDeleteEntry(collectionEntry1);

    // Virtual collections should be removed from the store
    expect(
      Collections.Store.get(
        virtualCollectionId(collectionEntry1.id, 'Related'),
      ),
    ).toBeNull();
    expect(
      Collections.Store.get(
        virtualCollectionId(collectionEntry1.id, 'References'),
      ),
    ).toBeNull();
  });
});
