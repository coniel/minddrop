import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { CollectionsStore } from '../CollectionsStore';
import { CollectionDeletedEvent } from '../events';
import { MockFs, cleanup, collection_1, setup } from '../test-utils';
import { getCollectionFilePath } from '../utils';
import { deleteCollection } from './deleteCollection';

describe('deleteCollection', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('deletes the collection from the store', async () => {
    await deleteCollection(collection_1.id);

    expect(CollectionsStore.get(collection_1.id)).toBeNull();
  });

  it('deletes the collection config from the file system', async () => {
    await deleteCollection(collection_1.id);

    expect(MockFs.exists(getCollectionFilePath(collection_1.id))).toBe(false);
  });

  it('dispatches the collection deleted event', async () =>
    new Promise<void>((done) => {
      Events.addListener(
        CollectionDeletedEvent,
        'test-collection-deleted',
        (payload) => {
          expect(payload.data).toEqual(collection_1);
          done();
        },
      );

      deleteCollection(collection_1.id);
    }));
});
