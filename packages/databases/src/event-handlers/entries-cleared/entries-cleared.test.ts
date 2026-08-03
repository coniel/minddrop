import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Collections } from '@minddrop/collections';
import {
  cleanup,
  collectionDatabase,
  collectionEntry1,
  objectDatabase,
  objectEntry1,
  setup,
} from '../../test-utils';
import { virtualCollectionId, virtualCollectionName } from '../../utils';
import { onClearEntries } from './entries-cleared';

vi.mock('../../sql', () => ({
  sqlDeleteEntries: vi.fn(),
}));

describe('onClearEntries', () => {
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

  it('does nothing if no entries were cleared', async () => {
    // Call the handler with no entries
    await onClearEntries({ databaseId: collectionDatabase.id, entries: [] });

    // Virtual collections should still exist
    expect(
      Collections.Store.get(
        virtualCollectionId(collectionEntry1.id, 'Related'),
      ),
    ).not.toBeNull();
  });

  it('does nothing if the database has no collection properties', async () => {
    // Call the handler with an entry from a database without collection properties
    await onClearEntries({
      databaseId: objectDatabase.id,
      entries: [objectEntry1],
    });

    // Virtual collections should still exist
    expect(
      Collections.Store.get(
        virtualCollectionId(collectionEntry1.id, 'Related'),
      ),
    ).not.toBeNull();
  });

  it('deletes virtual collections for the cleared entries', async () => {
    // Call the handler
    await onClearEntries({
      databaseId: collectionDatabase.id,
      entries: [collectionEntry1],
    });

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
