import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import {
  Fs,
  InvalidPathError,
  initializeMockFileSystem,
} from '@minddrop/file-system';
import { CollectionsStore } from '../CollectionsStore';
import {
  cleanup,
  collectionFiles,
  collections,
  collectionsPath,
  setup,
} from '../test-utils';
import { loadCollections } from './loadCollections';

const MockFs = initializeMockFileSystem(collectionFiles);

describe('loadCollections', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the path does not exist', async () => {
    await expect(loadCollections('non-existent-path')).rejects.toThrowError(
      InvalidPathError,
    );
  });

  it('loads collections into the store', async () => {
    await loadCollections(collectionsPath);

    expect(Object.values(CollectionsStore.getState().collections)).toEqual(
      collections,
    );
  });

  it('ignores directories without a collection file', async () => {
    MockFs.createDir(Fs.concatPath(collectionsPath, 'Foo'));

    await loadCollections(collectionsPath);

    expect(Object.values(CollectionsStore.getState().collections)).toEqual(
      collections,
    );
  });

  it('ignores invalid collection files', async () => {
    MockFs.createDir(Fs.concatPath(collectionsPath, 'Foo'));
    MockFs.createDir(Fs.concatPath(collectionsPath, 'Foo', '.minddrop'));
    MockFs.writeTextFile(
      Fs.concatPath(collectionsPath, 'Foo', '.minddrop', 'collection.json'),
      'invalid JSON',
    );

    await loadCollections(collectionsPath);

    expect(Object.values(CollectionsStore.getState().collections)).toEqual(
      collections,
    );
  });

  it('dispatches a collections load event', async () =>
    new Promise<void>((done) => {
      Events.addListener('collections:load', 'test', (payload) => {
        // Payload data should be the loaded collections
        expect(payload.data).toEqual(collections);
        done();
      });

      loadCollections(collectionsPath);
    }));
});
