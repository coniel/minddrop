import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InvalidParameterError } from '@minddrop/core';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { CollectionsStore } from '../CollectionsStore';
import { CollectionNotFoundError } from '../errors';
import { getCollection } from '../getCollection';
import {
  cleanup,
  itemsCollection,
  itemsCollectionFileDescriptor,
  setup,
  textPropertyScehma,
} from '../test-utils';
import { addPropertyToCollection } from './addPropertyToCollection';

const MockFs = initializeMockFileSystem([itemsCollectionFileDescriptor]);

describe('addPropertyToCollection', () => {
  beforeEach(() => {
    setup();

    // Add a collection to the store
    CollectionsStore.getState().add(itemsCollection);
  });

  afterEach(() => {
    cleanup();
    MockFs.reset();
  });

  it('throws if the collection does not exist', async () => {
    expect(() =>
      addPropertyToCollection('missing', 'Foo', textPropertyScehma),
    ).rejects.toThrow(CollectionNotFoundError);
  });

  it('adds the property to the collection', async () => {
    await addPropertyToCollection(
      itemsCollection.path,
      'Foo',
      textPropertyScehma,
    );

    expect(getCollection(itemsCollection.path)?.properties).toEqual({
      Foo: textPropertyScehma,
    });
  });

  it('throws if the property already exists', async () => {
    // Add same property twice
    await addPropertyToCollection(
      itemsCollection.path,
      'Foo',
      textPropertyScehma,
    );

    expect(() =>
      addPropertyToCollection(itemsCollection.path, 'Foo', textPropertyScehma),
    ).rejects.toThrow(InvalidParameterError);
  });
});
