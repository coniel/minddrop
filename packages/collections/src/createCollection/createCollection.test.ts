import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import {
  Fs,
  InvalidPathError,
  PathConflictError,
  initializeMockFileSystem,
} from '@minddrop/file-system';
import { ICONS_TEST_DATA } from '@minddrop/icons';
import { CollectionsStore } from '../CollectionsStore';
import { getCollectionsConfig } from '../getCollectionsConfig';
import { cleanup, collectionsConfigFileDescriptor, setup } from '../test-utils';
import { createCollection } from './createCollection';

const { contentIconString } = ICONS_TEST_DATA;

const BASE_PATH = 'path/to/collections';

const MockFs = initializeMockFileSystem([
  collectionsConfigFileDescriptor,
  BASE_PATH,
  `${BASE_PATH}/Notes`,
]);

describe('createCollection', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanup();

    MockFs.reset();
  });

  it('throws if the path is invalid', () => {
    expect(() =>
      createCollection('foo', {
        type: 'markdown',
        name: 'Notes',
        itemName: 'Note',
      }),
    ).rejects.toThrowError(InvalidPathError);
  });

  it('throws if the path already exists', () => {
    expect(() =>
      createCollection(BASE_PATH, {
        type: 'markdown',
        name: 'Notes',
        itemName: 'Note',
      }),
    ).rejects.toThrowError(PathConflictError);
  });

  it('creates the collection directory', async () => {
    await createCollection(BASE_PATH, {
      type: 'markdown',
      name: 'Tasks',
      itemName: 'Task',
    });

    expect(await Fs.exists(Fs.concatPath(BASE_PATH, 'Tasks'))).toBe(true);
  });

  it('returns the collection', async () => {
    const collection = await createCollection(BASE_PATH, {
      type: 'markdown',
      name: 'Tasks',
      itemName: 'Task',
      description: 'A collection of tasks',
      icon: contentIconString,
    });

    expect(collection).toEqual({
      type: 'markdown',
      path: Fs.concatPath(BASE_PATH, 'Tasks'),
      name: 'Tasks',
      itemName: 'Task',
      created: expect.any(Date),
      lastModified: expect.any(Date),
      description: 'A collection of tasks',
      icon: contentIconString,
      properties: [],
    });
  });

  it('creates the collection metadata file', async () => {
    const { path, ...config } = await createCollection(BASE_PATH, {
      type: 'markdown',
      name: 'Tasks',
      itemName: 'Task',
    });

    expect(
      await Fs.exists(
        Fs.concatPath(BASE_PATH, 'Tasks', '.minddrop', 'collection.json'),
      ),
    ).toBe(true);
    expect(
      await Fs.readTextFile(
        Fs.concatPath(BASE_PATH, 'Tasks', '.minddrop', 'collection.json'),
      ),
    ).toEqual(JSON.stringify(config));
  });

  it('adds the collection to the store', async () => {
    const collection = await createCollection(BASE_PATH, {
      type: 'markdown',
      name: 'Tasks',
      itemName: 'Task',
    });

    expect(CollectionsStore.getState().collections[collection.path]).toEqual({
      ...collection,
      properties: [],
      path: Fs.concatPath(BASE_PATH, 'Tasks'),
    });
  });

  it('persists collection to collections config file', async () => {
    const collection = await createCollection(BASE_PATH, {
      type: 'markdown',
      name: 'Tasks',
      itemName: 'Task',
    });

    // Get the collections config
    const config = await getCollectionsConfig();

    // It should persist the new collection
    expect(config.paths.includes(collection.path)).toBe(true);
  });

  it('dispatches a collections create event', async () =>
    new Promise<void>((done) => {
      Events.addListener('collections:collection:create', 'test', (payload) => {
        // Payload data should be the collection config
        expect(payload.data).toEqual({
          type: 'markdown',
          name: 'Tasks',
          itemName: 'Task',
          created: expect.any(Date),
          lastModified: expect.any(Date),
          path: Fs.concatPath(BASE_PATH, 'Tasks'),
          properties: [],
        });
        done();
      });

      createCollection(BASE_PATH, {
        type: 'markdown',
        name: 'Tasks',
        itemName: 'Task',
      });
    }));
});
