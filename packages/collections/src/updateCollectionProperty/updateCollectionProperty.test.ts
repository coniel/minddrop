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
import { updateCollectionProperty } from './updateCollectionProperty';

const MockFs = initializeMockFileSystem([itemsCollectionFileDescriptor]);

describe('updateCollectionProperty', () => {
  beforeEach(() => {
    setup();

    CollectionsStore.getState().add({
      ...itemsCollection,
      properties: [CheckboxPropertySchema],
    });
  });

  afterEach(() => {
    cleanup();

    MockFs.reset();
  });

  it('throws if the collection does not exist', async () => {
    await expect(
      updateCollectionProperty('missing', 'Checkbox', {
        ...CheckboxPropertySchema,
        defaultChecked: true,
      }),
    ).rejects.toThrow(CollectionNotFoundError);
  });

  it('throws if the property does not exist', async () => {
    await expect(
      updateCollectionProperty(itemsCollection.path, 'missing', {
        ...CheckboxPropertySchema,
        defaultChecked: true,
      }),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('updates the property', async () => {
    await updateCollectionProperty(itemsCollection.path, 'Checkbox', {
      ...CheckboxPropertySchema,
      defaultChecked: true,
    });

    const updatedCollection = getCollection(itemsCollection.path);

    expect(updatedCollection?.properties).toEqual([
      {
        ...CheckboxPropertySchema,
        defaultChecked: true,
      },
    ]);
  });
});
