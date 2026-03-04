import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { CollectionsStore } from '../CollectionsStore';
import { CollectionUpdatedEvent, CollectionUpdatedEventData } from '../events';
import { MockFs, cleanup, collection_1, mockDate, setup } from '../test-utils';
import { getCollectionFilePath } from '../utils';
import { addCollectionEntries } from './addCollectionEntries';

const newEntryIds = ['entry-new-1', 'entry-new-2'];

describe('addCollectionEntries', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('adds entries to the collection', async () => {
    const result = await addCollectionEntries(collection_1.id, newEntryIds);

    expect(result.entries).toEqual([...collection_1.entries, ...newEntryIds]);
  });

  it('ignores duplicate entry IDs', async () => {
    // Include an entry ID that already exists in the collection
    const result = await addCollectionEntries(collection_1.id, [
      collection_1.entries[0],
      'entry-new-1',
    ]);

    expect(result.entries).toEqual([...collection_1.entries, 'entry-new-1']);
  });

  it('updates the collection in the store', async () => {
    const result = await addCollectionEntries(collection_1.id, newEntryIds);

    expect(CollectionsStore.get(collection_1.id)).toEqual(result);
  });

  it('updates lastModified', async () => {
    const result = await addCollectionEntries(collection_1.id, newEntryIds);

    expect(result.lastModified).toEqual(mockDate);
  });

  it('writes the collection config to the file system', async () => {
    const result = await addCollectionEntries(collection_1.id, newEntryIds);

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
            ...collection_1.entries,
            ...newEntryIds,
          ]);
          done();
        },
      );

      addCollectionEntries(collection_1.id, newEntryIds);
    }));
});
