import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Collections } from '@minddrop/collections';
import {
  cleanup,
  collectionDatabase,
  collectionEntry1,
  objectDatabase,
  setup,
} from '../../test-utils';
import { virtualCollectionId, virtualCollectionName } from '../../utils';
import { onDeleteDatabase } from './database-deleted';

describe('onDeleteDatabase', () => {
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
    // Delete a database without collection properties
    await onDeleteDatabase(objectDatabase);

    // Virtual collections should be unchanged
    const related = Collections.Store.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );
    expect(related).not.toBeNull();
  });

  it('deletes all virtual collections for the database entries', async () => {
    // Delete the collection database
    await onDeleteDatabase(collectionDatabase);

    // All virtual collections should be deleted
    const related = Collections.Store.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );
    const references = Collections.Store.get(
      virtualCollectionId(collectionEntry1.id, 'References'),
    );

    expect(related).toBeNull();
    expect(references).toBeNull();
  });
});
