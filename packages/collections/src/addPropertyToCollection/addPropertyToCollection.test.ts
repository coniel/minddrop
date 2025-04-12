import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { CollectionsStore } from '../CollectionsStore';
import { TextPropertySchema } from '../constants';
import { CollectionNotFoundError } from '../errors';
import { getCollection } from '../getCollection';
import {
  cleanup,
  itemsCollection,
  itemsCollectionFileDescriptor,
  setup,
} from '../test-utils';
import { CollectionPropertyType } from '../types';
import { addPropertyToCollection } from './addPropertyToCollection';

const MockFs = initializeMockFileSystem([itemsCollectionFileDescriptor]);

describe('addPropertyToCollection', () => {
  beforeEach(() => {
    setup();

    // Add a collection to the store
    CollectionsStore.getState().add({
      ...itemsCollection,
      properties: [],
    });
  });

  afterEach(() => {
    cleanup();
    MockFs.reset();
  });

  it('throws if the collection does not exist', async () => {
    expect(() =>
      addPropertyToCollection('missing', 'Foo', CollectionPropertyType.Text),
    ).rejects.toThrow(CollectionNotFoundError);
  });

  it('adds the property to the collection', async () => {
    await addPropertyToCollection(
      itemsCollection.path,
      'Foo',
      CollectionPropertyType.Text,
    );

    expect(getCollection(itemsCollection.path)?.properties).toEqual([
      {
        ...TextPropertySchema,
        name: 'Foo',
      },
    ]);
  });

  it('increments name on conflict', async () => {
    // Add same property twice
    await addPropertyToCollection(
      itemsCollection.path,
      'Foo',
      CollectionPropertyType.Text,
    );
    await addPropertyToCollection(
      itemsCollection.path,
      'Foo',
      CollectionPropertyType.Text,
    );
    expect(getCollection(itemsCollection.path)?.properties).toEqual([
      {
        ...TextPropertySchema,
        name: 'Foo',
      },
      {
        ...TextPropertySchema,
        name: 'Foo 1',
      },
    ]);
  });
});
