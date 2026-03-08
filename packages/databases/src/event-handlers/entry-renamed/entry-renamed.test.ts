import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Collections } from '@minddrop/collections';
import {
  cleanup,
  collectionDatabase,
  collectionEntry1,
  objectEntry1,
  setup,
} from '../../test-utils';
import { virtualCollectionId, virtualCollectionName } from '../../utils';
import { onRenameEntry } from './entry-renamed';

describe('onRenameEntry', () => {
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

  it('does nothing if the database has no collection properties', async () => {
    // Call the handler with an entry from a database without collection properties
    await onRenameEntry({
      original: objectEntry1,
      updated: { ...objectEntry1, title: 'Renamed' },
    });

    // Virtual collection names should be unchanged
    const collection = Collections.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );
    expect(collection.name).toBe(
      virtualCollectionName(
        collectionDatabase.name,
        collectionEntry1.title,
        'Related',
      ),
    );
  });

  it('updates collection names to reflect the new entry title', async () => {
    // Simulate a renamed entry
    const renamedEntry = {
      ...collectionEntry1,
      title: 'Renamed Entry',
    };

    // Call the handler
    await onRenameEntry({
      original: collectionEntry1,
      updated: renamedEntry,
    });

    // Collection names should reflect the new entry title
    const relatedCollection = Collections.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );
    const referencesCollection = Collections.get(
      virtualCollectionId(collectionEntry1.id, 'References'),
    );

    expect(relatedCollection.name).toBe(
      virtualCollectionName(
        collectionDatabase.name,
        'Renamed Entry',
        'Related',
      ),
    );
    expect(referencesCollection.name).toBe(
      virtualCollectionName(
        collectionDatabase.name,
        'Renamed Entry',
        'References',
      ),
    );
  });
});
