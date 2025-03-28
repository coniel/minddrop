import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import {
  Fs,
  InvalidPathError,
  PathConflictError,
  initializeMockFileSystem,
} from '@minddrop/file-system';
import { UserIconType } from '@minddrop/icons';
import { CollectionsStore } from '../CollectionsStore';
import { cleanup, setup } from '../test-utils';
import { CollectionType } from '../types';
import { createCollection } from './createCollection';

const BASE_PATH = 'path/to/collections';

const MockFs = initializeMockFileSystem([BASE_PATH, `${BASE_PATH}/Notes`]);

describe('createCollection', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanup();

    MockFs.reset();
  });

  it('throws if the path is invalid', () => {
    expect(() =>
      createCollection('foo', {
        type: CollectionType.JSON,
        name: 'Notes',
        itemName: 'Note',
      }),
    ).rejects.toThrowError(InvalidPathError);
  });

  it('throws if the path already exists', () => {
    expect(() =>
      createCollection(BASE_PATH, {
        type: CollectionType.JSON,
        name: 'Notes',
        itemName: 'Note',
      }),
    ).rejects.toThrowError(PathConflictError);
  });

  it('creates the collection directory', async () => {
    await createCollection(BASE_PATH, {
      type: CollectionType.JSON,
      name: 'Tasks',
      itemName: 'Task',
    });

    expect(await Fs.exists(Fs.concatPath(BASE_PATH, 'Tasks'))).toBe(true);
  });

  it('returns the collection', async () => {
    const collection = await createCollection(BASE_PATH, {
      type: CollectionType.JSON,
      name: 'Tasks',
      itemName: 'Task',
      description: 'A collection of tasks',
      icon: {
        type: UserIconType.ContentIcon,
        icon: 'check',
        color: 'blue',
      },
    });

    expect(collection).toEqual({
      type: CollectionType.JSON,
      name: 'Tasks',
      itemName: 'Task',
      created: expect.any(Date),
      lastModified: expect.any(Date),
      description: 'A collection of tasks',
      icon: {
        type: UserIconType.ContentIcon,
        icon: 'check',
        color: 'blue',
      },
    });
  });

  it('creates the collection metadata file', async () => {
    const collection = await createCollection(BASE_PATH, {
      type: CollectionType.JSON,
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
    ).toEqual(JSON.stringify(collection));
  });

  it('adds the collection to the store', async () => {
    const collection = await createCollection(BASE_PATH, {
      type: CollectionType.JSON,
      name: 'Tasks',
      itemName: 'Task',
    });

    expect(CollectionsStore.getState().collections[collection.name]).toEqual(
      collection,
    );
  });

  it('dispatches a collections create event', async () =>
    new Promise<void>((done) => {
      Events.addListener('collections:collection:create', 'test', (payload) => {
        // Payload data should be the collection
        expect(payload.data).toEqual({
          type: CollectionType.JSON,
          name: 'Tasks',
          itemName: 'Task',
          created: expect.any(Date),
          lastModified: expect.any(Date),
        });
        done();
      });

      createCollection(BASE_PATH, {
        type: CollectionType.JSON,
        name: 'Tasks',
        itemName: 'Task',
      });
    }));
});
