import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Collections } from '@minddrop/collections';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import {
  cleanup,
  collectionDatabase,
  collectionEntry1,
  databaseEntries,
  setup,
} from '../test-utils';
import { virtualCollectionId, virtualCollectionName } from '../utils';
import { initializeDatabaseEntries } from './initializeDatabaseEntries';

describe('initializeDatabaseEntries', () => {
  beforeEach(() => setup({ loadDatabaseEntries: false }));

  afterEach(cleanup);

  it('loads database entries into the store from the file system', async () => {
    // Initialize database entries
    await initializeDatabaseEntries();

    // Should load all entries into the store
    expect(DatabaseEntriesStore.getAllArray()).toEqual(databaseEntries);
  });

  it('hydrates virtual collections from entries with collection properties', async () => {
    // Initialize database entries
    await initializeDatabaseEntries();

    // Should create virtual collections for each collection property
    const relatedCollection = Collections.Store.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );
    const referencesCollection = Collections.Store.get(
      virtualCollectionId(collectionEntry1.id, 'References'),
    );

    // Virtual collections should exist
    expect(relatedCollection).not.toBeNull();
    expect(referencesCollection).not.toBeNull();

    // Virtual collections should be marked as virtual
    expect(relatedCollection!.virtual).toBe(true);
    expect(referencesCollection!.virtual).toBe(true);

    // Virtual collections should have the correct names
    expect(relatedCollection!.name).toBe(
      virtualCollectionName(
        collectionDatabase.name,
        collectionEntry1.title,
        'Related',
      ),
    );
    expect(referencesCollection!.name).toBe(
      virtualCollectionName(
        collectionDatabase.name,
        collectionEntry1.title,
        'References',
      ),
    );

    // Virtual collections should have the correct entries
    expect(relatedCollection!.entries).toEqual(
      collectionEntry1.properties.Related,
    );
    expect(referencesCollection!.entries).toEqual(
      collectionEntry1.properties.References,
    );
  });

  it('does not create virtual collections for databases without collection properties', async () => {
    // Initialize database entries
    await initializeDatabaseEntries();

    // Should not create virtual collections for non-collection entries
    const allCollections = Collections.Store.getAllArray();
    const virtualCollections = allCollections.filter(
      (collection) => collection.virtual,
    );

    // Only the collectionEntry1's two collection properties should produce virtual collections
    expect(virtualCollections).toHaveLength(2);
  });
});
