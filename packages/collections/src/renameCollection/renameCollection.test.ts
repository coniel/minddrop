import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import {
  Fs,
  InvalidPathError,
  PathConflictError,
  initializeMockFileSystem,
} from '@minddrop/file-system';
import { InvalidParameterError } from '@minddrop/utils';
import { CollectionsStore } from '../CollectionsStore';
import {
  CollectionConfigDirName,
  CollectionConfigFileName,
} from '../constants';
import { getCollection } from '../getCollection';
import { getCollectionsConfig } from '../getCollectionsConfig';
import {
  cleanup,
  collectionsConfigFileDescriptor,
  itemsCollection,
  itemsCollectionFileDescriptor,
  setup,
} from '../test-utils';
import { renameCollection } from './renameCollection';

const COLLECTION_PATH = itemsCollection.path;
const NEW_COLLECTION_NAME = 'New name';
const NEW_COLLECTION_PATH = `${itemsCollection.path
  .split('/')
  .slice(0, -1)
  .join('/')}/${NEW_COLLECTION_NAME}`;
const UPDATED_COLLECTION = {
  ...itemsCollection,
  name: NEW_COLLECTION_NAME,
  path: NEW_COLLECTION_PATH,
};

const MockFs = initializeMockFileSystem([
  // Collections config file
  collectionsConfigFileDescriptor,
  // Collection
  itemsCollectionFileDescriptor,
]);

describe('renameCollection', () => {
  beforeEach(() => {
    setup();

    // Reset mock file system
    MockFs.reset();

    // Add a collection to the store
    CollectionsStore.getState().add(itemsCollection);
  });

  afterEach(cleanup);

  it('throws if the collection does not exist', () => {
    // Attempt to rename a collection that is not in the store,
    // should throw a InvalidParameterError.
    expect(() =>
      renameCollection('missing-collection', NEW_COLLECTION_NAME),
    ).rejects.toThrowError(InvalidParameterError);
  });

  it('throws if the collection dir does not exist', () => {
    // Pretend that collection dir does not exist
    MockFs.removeDir(COLLECTION_PATH);

    // Attempt to rename a collection for which the dir is missing,
    // should throw a InvalidPathError.
    expect(() =>
      renameCollection(COLLECTION_PATH, NEW_COLLECTION_NAME),
    ).rejects.toThrowError(InvalidPathError);
  });

  it('throws if a conflicting dir already exists', () => {
    // Pretend that a dir with new collection name already exists
    MockFs.addFiles([NEW_COLLECTION_PATH]);

    // Attempt to rename a collection for which the new name would
    // cause a conflict, should throw a PathConflictError.
    expect(() =>
      renameCollection(COLLECTION_PATH, NEW_COLLECTION_NAME),
    ).rejects.toThrowError(PathConflictError);
  });

  it('renames the collection dir', async () => {
    // Rename a collection
    await renameCollection(COLLECTION_PATH, NEW_COLLECTION_NAME);

    // Old collection dir should no longer exist
    expect(MockFs.exists(COLLECTION_PATH)).toBeFalsy();
    // New collection dir should exist
    expect(MockFs.exists(NEW_COLLECTION_PATH)).toBeTruthy();
  });

  it('updates the collection in the store', async () => {
    // Rename a collection
    await renameCollection(COLLECTION_PATH, NEW_COLLECTION_NAME);

    // Store should contain renamed collection
    expect(getCollection(NEW_COLLECTION_PATH)).toEqual(UPDATED_COLLECTION);
    // Store should no longer contain original collection
    expect(getCollection(COLLECTION_PATH)).toBeNull();
  });

  it('writes the collection config file', async () => {
    // Rename a collection
    await renameCollection(COLLECTION_PATH, NEW_COLLECTION_NAME);

    // Get the collections config file
    const configFile = MockFs.readTextFile(
      Fs.concatPath(
        NEW_COLLECTION_PATH,
        CollectionConfigDirName,
        CollectionConfigFileName,
      ),
    );

    // Config file should be updated
    expect(JSON.parse(configFile).name).toBe(NEW_COLLECTION_NAME);
  });

  it('updates the collections config file', async () => {
    // Rename a collection
    await renameCollection(COLLECTION_PATH, NEW_COLLECTION_NAME);

    // Get the collections config
    const config = await getCollectionsConfig();

    // Config should contain new collection path
    expect(config.paths.includes(NEW_COLLECTION_PATH)).toBeTruthy();
    // Config should no longer contain old collection path
    expect(config.paths.includes(COLLECTION_PATH)).toBeFalsy();
  });

  it('dispatches a collection rename event', () =>
    new Promise<void>((done) => {
      Events.addListener('collections:collection:rename', 'test', (payload) => {
        // Payload data should contain old and new paths
        expect(payload.data).toEqual({
          oldPath: COLLECTION_PATH,
          newPath: NEW_COLLECTION_PATH,
        });
        done();
      });

      // Rename a collection
      renameCollection(COLLECTION_PATH, NEW_COLLECTION_NAME);
    }));

  it('returns the updated collection', async () => {
    // Should return updated collection
    expect(
      await renameCollection(COLLECTION_PATH, NEW_COLLECTION_NAME),
    ).toEqual(UPDATED_COLLECTION);
  });
});
