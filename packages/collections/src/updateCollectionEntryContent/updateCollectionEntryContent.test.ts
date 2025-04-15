import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, itemsCollection, itemsEntry1, setup } from '../test-utils';
import { updateCollectionEntryContent } from './updateCollectionEntryContent';

describe('updateCollectionEntryContent', () => {
  beforeEach(() =>
    setup({
      loadCollections: true,
      loadCollectionTypeConfigs: true,
      loadCollectionEntries: true,
    }),
  );

  afterEach(cleanup);

  it('updates the content of a collection entry', async () => {
    const updated = await updateCollectionEntryContent(
      itemsCollection.path,
      itemsEntry1.path,
      'Updated content',
    );

    expect(updated.content).toEqual('Updated content');
  });
});
