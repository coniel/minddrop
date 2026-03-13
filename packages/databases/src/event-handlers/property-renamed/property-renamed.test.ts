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
import { onRenameProperty } from './property-renamed';

vi.mock('../../sql', () => ({
  sqlRenameProperty: vi.fn(),
}));

describe('onRenameProperty', () => {
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

  it('does nothing if the renamed property is not a collection type', async () => {
    // Rename a non-collection property
    await onRenameProperty({
      database: objectDatabase,
      oldName: 'Content',
      newName: 'Body',
    });

    // Virtual collections should be unchanged
    const related = Collections.Store.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );
    expect(related).not.toBeNull();
  });

  it('replaces virtual collections with new ones under the new property name', async () => {
    // Rename the 'Related' collection property to 'Links'
    const renamedDatabase = {
      ...collectionDatabase,
      properties: collectionDatabase.properties.map((property) =>
        property.name === 'Related' ? { ...property, name: 'Links' } : property,
      ),
    };

    await onRenameProperty({
      database: renamedDatabase,
      oldName: 'Related',
      newName: 'Links',
    });

    // The old virtual collection should be deleted
    const oldCollection = Collections.Store.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );
    expect(oldCollection).toBeNull();

    // A new virtual collection should exist with the new name
    const newCollection = Collections.Store.get(
      virtualCollectionId(collectionEntry1.id, 'Links'),
    );
    expect(newCollection).not.toBeNull();
    expect(newCollection!.virtual).toBe(true);
    expect(newCollection!.name).toBe(
      virtualCollectionName(
        collectionDatabase.name,
        collectionEntry1.title,
        'Links',
      ),
    );

    // The new collection should have the same entries as the old one
    expect(newCollection!.entries).toEqual(collectionEntry1.properties.Related);
  });

  it('does not affect other collection properties', async () => {
    // Rename the 'Related' collection property
    const renamedDatabase = {
      ...collectionDatabase,
      properties: collectionDatabase.properties.map((property) =>
        property.name === 'Related' ? { ...property, name: 'Links' } : property,
      ),
    };

    await onRenameProperty({
      database: renamedDatabase,
      oldName: 'Related',
      newName: 'Links',
    });

    // The 'References' virtual collection should be unchanged
    const references = Collections.Store.get(
      virtualCollectionId(collectionEntry1.id, 'References'),
    );
    expect(references).not.toBeNull();
    expect(references!.name).toBe(
      virtualCollectionName(
        collectionDatabase.name,
        collectionEntry1.title,
        'References',
      ),
    );
  });
});
