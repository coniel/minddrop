import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { CollectionsStore } from '../CollectionsStore';
import { CollectionUpdatedEvent, CollectionUpdatedEventData } from '../events';
import { MockFs, cleanup, collection_1, mockDate, setup } from '../test-utils';
import { getCollectionFilePath } from '../utils';
import { removeCollectionEntries } from './removeCollectionEntries';

describe('removeCollectionEntries', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes entries from the collection', async () => {
    // Remove the first entry
    const result = await removeCollectionEntries(collection_1.id, [
      collection_1.entries[0],
    ]);

    expect(result.entries).toEqual([collection_1.entries[1]]);
  });

  it('ignores entry IDs that are not in the collection', async () => {
    const result = await removeCollectionEntries(collection_1.id, [
      'nonexistent-entry',
    ]);

    expect(result.entries).toEqual(collection_1.entries);
  });

  it('updates the collection in the store', async () => {
    const result = await removeCollectionEntries(collection_1.id, [
      collection_1.entries[0],
    ]);

    expect(CollectionsStore.get(collection_1.id)).toEqual(result);
  });

  it('updates lastModified', async () => {
    const result = await removeCollectionEntries(collection_1.id, [
      collection_1.entries[0],
    ]);

    expect(result.lastModified).toEqual(mockDate);
  });

  it('writes the collection config to the file system', async () => {
    const result = await removeCollectionEntries(collection_1.id, [
      collection_1.entries[0],
    ]);

    expect(MockFs.readJsonFile(getCollectionFilePath(collection_1.id))).toEqual(
      result,
    );
  });

  it('dispatches the collection updated event', async () =>
    new Promise<void>((done) => {
      Events.addListener<CollectionUpdatedEventData>(
        CollectionUpdatedEvent,
        'test-collection-updated',
        (payload) => {
          expect(payload.data.original).toEqual(collection_1);
          expect(payload.data.updated.entries).toEqual([
            collection_1.entries[1],
          ]);
          done();
        },
      );

      removeCollectionEntries(collection_1.id, [collection_1.entries[0]]);
    }));
});
