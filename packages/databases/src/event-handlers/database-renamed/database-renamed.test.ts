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
import { onRenameDatabase } from './database-renamed';

vi.mock('../../sql', () => ({
  sqlUpsertDatabase: vi.fn(),
}));

describe('onRenameDatabase', () => {
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
    // Rename a database without collection properties
    await onRenameDatabase({
      original: objectDatabase,
      updated: { ...objectDatabase, name: 'Renamed Objects' },
    });

    // Virtual collections should be unchanged
    const related = Collections.Store.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );
    expect(related!.name).toBe(
      virtualCollectionName(
        collectionDatabase.name,
        collectionEntry1.title,
        'Related',
      ),
    );
  });

  it('updates virtual collection names to reflect the new database name', async () => {
    // Rename the collection database
    const updated = { ...collectionDatabase, name: 'Renamed Database' };

    await onRenameDatabase({ original: collectionDatabase, updated });

    // Virtual collection names should reflect the new database name
    const related = Collections.Store.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );
    const references = Collections.Store.get(
      virtualCollectionId(collectionEntry1.id, 'References'),
    );

    expect(related!.name).toBe(
      virtualCollectionName(
        'Renamed Database',
        collectionEntry1.title,
        'Related',
      ),
    );
    expect(references!.name).toBe(
      virtualCollectionName(
        'Renamed Database',
        collectionEntry1.title,
        'References',
      ),
    );
  });
});
