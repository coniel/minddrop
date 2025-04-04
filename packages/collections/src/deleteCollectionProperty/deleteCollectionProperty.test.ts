import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InvalidParameterError } from '@minddrop/core';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { CollectionsStore } from '../CollectionsStore';
import { CheckboxPropertySchema } from '../constants';
import { CollectionNotFoundError } from '../errors';
import { getCollection } from '../getCollection';
import {
  cleanup,
  itemsCollection,
  itemsCollectionFileDescriptor,
  setup,
} from '../test-utils';
import { deleteCollectionProperty } from './deleteCollectionProperty';

const MockFs = initializeMockFileSystem([itemsCollectionFileDescriptor]);

describe('deleteCollectionProperty', () => {
  beforeEach(() => {
    setup();

    CollectionsStore.getState().add({
      ...itemsCollection,
      properties: {
        Checkbox: CheckboxPropertySchema,
      },
    });
  });

  afterEach(() => {
    cleanup();

    MockFs.reset();
  });

  it('throws if the collection does not exist', async () => {
    await expect(
      deleteCollectionProperty('missing', 'Checkbox'),
    ).rejects.toThrow(CollectionNotFoundError);
  });

  it('throws if the property does not exist', async () => {
    await expect(
      deleteCollectionProperty(itemsCollection.path, 'missing'),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('deletes the property from the collection', async () => {
    await deleteCollectionProperty(itemsCollection.path, 'Checkbox');

    const collection = getCollection(itemsCollection.path);

    expect(collection?.properties).toEqual({});
  });
});
