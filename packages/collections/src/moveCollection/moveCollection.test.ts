import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import {
  InvalidPathError,
  PathConflictError,
  initializeMockFileSystem,
} from '@minddrop/file-system';
import { CollectionsStore } from '../CollectionsStore';
import { getCollection } from '../getCollection';
import { getCollectionsConfig } from '../getCollectionsConfig';
import {
  cleanup,
  collectionsConfigFileDescriptor,
  itemsCollection,
  setup,
} from '../test-utils';
import { moveCollection } from './moveCollection';

const COLLECTION_PATH = itemsCollection.path;
const DESTINATION_PATH = 'New/Path';
const NEW_COLLECTION_PATH = `New/Path/${itemsCollection.name}`;

const MockFs = initializeMockFileSystem([
  // Collections config file
  collectionsConfigFileDescriptor,
  // Collection
  COLLECTION_PATH,
  // Destination dir
  DESTINATION_PATH,
]);

describe('moveCollection', () => {
  beforeEach(() => {
    setup();

    // Add a collection to the store
    CollectionsStore.getState().add(itemsCollection);

    // Reset mock file system
    MockFs.reset();
  });

  afterEach(cleanup);

  it('throws if the collection path does not exist', () => {
    // Pretend collection path does not exist
    MockFs.removeFile(COLLECTION_PATH);

    // Attempt to move a collection from an invalid path,
    // should throw a InvalidPathError.
    expect(() =>
      moveCollection(COLLECTION_PATH, DESTINATION_PATH),
    ).rejects.toThrowError(InvalidPathError);
  });

  it('throws if the destination path does not exist', () => {
    // Pretend destination path does not exist
    MockFs.removeDir(DESTINATION_PATH);

    // Attempt to move a collection to an invalid destination,
    // should throw a InvalidPathError.
    expect(() =>
      moveCollection(COLLECTION_PATH, DESTINATION_PATH),
    ).rejects.toThrowError(InvalidPathError);
  });

  it('throws if the there is a conflicting dir', () => {
    // Pretend destination path already contains a dir
    // of the same name.
    MockFs.addFiles([NEW_COLLECTION_PATH]);

    // Attempt to move a collection with a conflicting dir,
    // should throw a PathConflictError.
    expect(() =>
      moveCollection(COLLECTION_PATH, DESTINATION_PATH),
    ).rejects.toThrowError(PathConflictError);
  });

  it('moves the collection dir', async () => {
    // Move a collection
    await moveCollection(COLLECTION_PATH, DESTINATION_PATH);

    // Original dir should no longer exist
    expect(MockFs.exists(COLLECTION_PATH)).toBeFalsy();
    // New dir should exist
    expect(MockFs.exists(NEW_COLLECTION_PATH)).toBeTruthy();
  });

  it('updates the collection path in the store', async () => {
    // Move a collection
    await moveCollection(COLLECTION_PATH, DESTINATION_PATH);

    // Should update the collection path in the store
    expect(getCollection(NEW_COLLECTION_PATH)).toBeDefined();
    // Should remove old collection path from store
    expect(getCollection(COLLECTION_PATH)).toBeNull();
  });

  it('updates the collections config file', async () => {
    // Move a collection
    await moveCollection(COLLECTION_PATH, DESTINATION_PATH);

    // Get collections config
    const config = await getCollectionsConfig();

    // Should write updated collection path to config
    expect(config.paths.includes(NEW_COLLECTION_PATH)).toBeTruthy();
  });

  it('dispatches a collection move event', () =>
    new Promise<void>((done) => {
      Events.addListener('collections:collection:move', 'test', (payload) => {
        // Payload data should contain old and new paths
        expect(payload.data).toEqual({
          oldPath: COLLECTION_PATH,
          newPath: NEW_COLLECTION_PATH,
        });
        done();
      });

      // Move a collection
      moveCollection(COLLECTION_PATH, DESTINATION_PATH);
    }));
});
