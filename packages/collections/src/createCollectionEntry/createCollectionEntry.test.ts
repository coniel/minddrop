import { afterEach, beforeEach, describe, expect, it } from 'vitest';
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

    expect(CollectionEntriesStore.getAll()).toEqual([itemsEntry1]);
  });

  it('returns the created entry', async () => {
    const entry = await createCollectionEntry(itemsCollection.path);

    expect(entry).toEqual(itemsEntry1);
  });

  it('dispatches a entries create event', async () =>
    new Promise<void>((done) => {
      Events.addListener('collections:entries:create', 'test', (payload) => {
        // Payload data should be created entry
        expect(payload.data).toEqual(itemsEntry1);
        done();
      });

      createCollectionEntry(itemsCollection.path);
    }));
});
