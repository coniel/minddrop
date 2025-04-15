import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { CollectionEntriesStore } from '../CollectionEntriesStore';
import { CollectionTypeConfigsStore } from '../CollectionTypeConfigsStore';
import {
  CollectionNotFoundError,
  CollectionTypeNotRegisteredError,
} from '../errors';
import {
  cleanup,
  filesCollection,
  itemsCollection,
  itemsEntry1,
  linksCollection,
  setup,
} from '../test-utils';
import { createCollectionEntry } from './createCollectionEntry';

const newEntry = {
  ...itemsEntry1,
  metadata: {
    created: expect.any(Date),
    lastModified: expect.any(Date),
  },
};

describe('createCollectionEntry', () => {
  beforeEach(() =>
    setup({
      loadCollections: true,
      loadCollectionTypeConfigs: true,
    }),
  );

  afterEach(cleanup);

  it('throws if the collection does not exist', async () => {
    await expect(() =>
      createCollectionEntry('non-existent-collection'),
    ).rejects.toThrow(CollectionNotFoundError);
  });

  it('throws if the collection type is not registered', async () => {
    CollectionTypeConfigsStore.clear();

    await expect(() =>
      createCollectionEntry(itemsCollection.path),
    ).rejects.toThrow(CollectionTypeNotRegisteredError);
  });

  it('throws if the collection type requires a file but invalid data is provided', async () => {
    await expect(() =>
      createCollectionEntry(filesCollection.path),
    ).rejects.toThrow(InvalidParameterError);

    await expect(() =>
      createCollectionEntry(filesCollection.path, 'https://example.com'),
    ).rejects.toThrow(InvalidParameterError);

    // Does not throw if a valid File is provided
    const file = new File(['foo'], 'foo.txt', { type: 'text/plain' });
    expect(() =>
      createCollectionEntry(filesCollection.path, file),
    ).not.toThrow();
  });

  it('throws if the collection type requires a URL but invalid data is provided', async () => {
    await expect(() =>
      createCollectionEntry(linksCollection.path),
    ).rejects.toThrow(InvalidParameterError);

    await expect(() =>
      createCollectionEntry(linksCollection.path, 'foo'),
    ).rejects.toThrow(InvalidParameterError);

    // Does not throw if a valid URL is provided
    expect(() =>
      createCollectionEntry(linksCollection.path, 'https://example.com'),
    ).not.toThrow();
  });

  it('creates a new entry and adds it to the entries store', async () => {
    await createCollectionEntry(itemsCollection.path);

    expect(CollectionEntriesStore.getAll()).toEqual([newEntry]);
  });

  it('returns the created entry', async () => {
    const entry = await createCollectionEntry(itemsCollection.path);

    expect(entry).toEqual(newEntry);
  });

  it('adds default properties to the entry', async () => {
    const entry = await createCollectionEntry(itemsCollection.path);

    expect(entry.properties).toEqual({ Genre: 'Non-Fiction' });
  });

  it('adds default metadata to the entry', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-01-01T00:00:00Z'));

    const entry = await createCollectionEntry(itemsCollection.path);

    expect(entry.metadata).toEqual({
      created: new Date('2023-01-01T00:00:00Z'),
      lastModified: new Date('2023-01-01T00:00:00Z'),
    });
  });

  it('dispatches a entries create event', async () =>
    new Promise<void>((done) => {
      Events.addListener('collections:entries:create', 'test', (payload) => {
        // Payload data should be created entry
        expect(payload.data).toEqual(newEntry);
        done();
      });

      createCollectionEntry(itemsCollection.path);
    }));
});
