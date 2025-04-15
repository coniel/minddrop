import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, itemsCollection, itemsEntry1, setup } from '../test-utils';
import { updateCollectionEntryProperties } from './updateCollectionEntryProperties';

describe('updateCollectionEntryProperties', () => {
  beforeEach(() => {
    setup({
      loadCollections: true,
      loadCollectionTypeConfigs: true,
      loadCollectionEntries: true,
    });
  });

  afterEach(cleanup);

  it('merges properties into the existing ones', async () => {
    const updated = await updateCollectionEntryProperties(
      itemsCollection.path,
      itemsEntry1.path,
      { foo: 'bar' },
    );

    expect(updated.properties).toEqual({
      ...itemsEntry1.properties,
      foo: 'bar',
    });
  });

  it('removes properties that are set to null', async () => {
    const update = { Genre: null };

    const updated = await updateCollectionEntryProperties(
      itemsCollection.path,
      itemsEntry1.path,
      update,
    );

    expect(updated.properties).toEqual({});
  });
});
