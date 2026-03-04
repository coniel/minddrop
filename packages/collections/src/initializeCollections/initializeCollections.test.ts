import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { CollectionsStore } from '../CollectionsStore';
import { CollectionsLoadedEvent } from '../events';
import { MockFs, cleanup, collections, setup } from '../test-utils';
import { getCollectionFilePath, getCollectionsDirPath } from '../utils';
import { initializeCollections } from './initializeCollections';

describe('initializeCollections', () => {
  beforeEach(() => setup({ loadCollections: false }));

  afterEach(cleanup);

  it('creates the collections directory if it does not exist', async () => {
    // Remove the collections directory
    MockFs.removeFile(getCollectionsDirPath());

    await initializeCollections();

    expect(MockFs.exists(getCollectionsDirPath())).toBe(true);
  });

  it('loads collections from the collections directory into the store', async () => {
    await initializeCollections();

    expect(CollectionsStore.getAllArray()).toEqual(collections);
  });

  it('filters out null collections', async () => {
    // Create an invalid collection file
    MockFs.writeTextFile(
      getCollectionFilePath('invalid-collection'),
      'invalid json',
    );

    await initializeCollections();

    expect(CollectionsStore.getAllArray()).toEqual(collections);
  });

  it('dispatches a collections loaded event', async () =>
    new Promise<void>((done) => {
      Events.addListener(CollectionsLoadedEvent, 'test', (payload) => {
        expect(payload.data).toEqual(collections);
        done();
      });

      initializeCollections();
    }));
});
