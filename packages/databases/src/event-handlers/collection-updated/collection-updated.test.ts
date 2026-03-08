import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CollectionFixtures, Collections } from '@minddrop/collections';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import {
  cleanup,
  collectionDatabase,
  collectionEntry1,
  objectEntry1,
  setup,
} from '../../test-utils';
import { virtualCollectionId, virtualCollectionName } from '../../utils';
import { onUpdateCollection } from './collection-updated';

const { collection_virtual_1 } = CollectionFixtures;

// Virtual collection for the Related property
const relatedCollectionId = virtualCollectionId(collectionEntry1.id, 'Related');
const relatedCollection = {
  ...collection_virtual_1,
  id: relatedCollectionId,
  name: virtualCollectionName(
    collectionDatabase.name,
    collectionEntry1.title,
    'Related',
  ),
  entries: collectionEntry1.properties.Related as string[],
};

describe('onUpdateCollection', () => {
  beforeEach(() => {
    setup();

    // Add the virtual collection to the store
    Collections.Store.set(relatedCollection);
  });

  afterEach(cleanup);

  it('does nothing for non-virtual collections', async () => {
    const { collection_1 } = CollectionFixtures;

    // Call the handler with a non-virtual collection update
    await onUpdateCollection({
      original: collection_1,
      updated: { ...collection_1, entries: ['new-entry'] },
    });

    // Entry should be unchanged
    const entry = DatabaseEntriesStore.get(collectionEntry1.id);
    expect(entry?.properties.Related).toEqual(
      collectionEntry1.properties.Related,
    );
  });

  it('updates the entry property with the collection entries', async () => {
    const updatedEntries = ['new-entry-1', 'new-entry-2'];
    const updatedCollection = {
      ...relatedCollection,
      entries: updatedEntries,
    };

    // Call the handler
    await onUpdateCollection({
      original: relatedCollection,
      updated: updatedCollection,
    });

    // Entry property should be updated with the new entries
    const entry = DatabaseEntriesStore.get(collectionEntry1.id);
    expect(entry?.properties.Related).toEqual(updatedEntries);
  });

  it('does nothing if the entry does not exist', async () => {
    const updatedCollection = {
      ...relatedCollection,
      id: 'nonexistent-entry:Related',
      entries: ['new-entry'],
    };

    // Should not throw
    await onUpdateCollection({
      original: { ...relatedCollection, id: 'nonexistent-entry:Related' },
      updated: updatedCollection,
    });
  });
});
