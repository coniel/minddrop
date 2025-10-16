import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { i18n } from '@minddrop/i18n';
import { CollectionEntriesStore } from '../CollectionEntriesStore';
import { CollectionTypeConfigsStore } from '../CollectionTypeConfigsStore';
import {
  CollectionNotFoundError,
  CollectionTypeNotRegisteredError,
} from '../errors';
import {
  cleanup,
  itemsCollection,
  itemsEntry1,
  itemsPropertiesDir,
  linksCollection,
  setup,
} from '../test-utils';
import { createTextCollectionEntry } from './createTextCollectionEntry';

const newEntry = {
  ...itemsEntry1,
  properties: {
    ...itemsEntry1.properties,
    created: expect.any(Date),
    lastModified: expect.any(Date),
    note: '',
  },
};

const customProperties = {
  title: itemsEntry1.properties.title,
};

const MockFs = initializeMockFileSystem([
  itemsCollection.path,
  linksCollection.path,
  itemsPropertiesDir,
]);

describe('createTextCollectionEntry', () => {
  beforeEach(() =>
    setup({
      loadCollections: true,
      loadCollectionTypeConfigs: true,
    }),
  );

  afterEach(() => {
    cleanup();
    MockFs.reset();
  });

  it('throws if the collection does not exist', async () => {
    await expect(() =>
      createTextCollectionEntry('non-existent-collection'),
    ).rejects.toThrow(CollectionNotFoundError);
  });

  it('throws if the collection type is not registered', async () => {
    CollectionTypeConfigsStore.clear();

    await expect(() =>
      createTextCollectionEntry(itemsCollection.path),
    ).rejects.toThrow(CollectionTypeNotRegisteredError);
  });

  it('creates a new entry and adds it to the entries store', async () => {
    await createTextCollectionEntry(itemsCollection.path, customProperties);

    expect(CollectionEntriesStore.getAll()).toEqual([newEntry]);
  });

  it('returns the created entry', async () => {
    const entry = await createTextCollectionEntry(
      itemsCollection.path,
      customProperties,
    );

    expect(entry).toEqual(newEntry);
  });

  it('adds default collection properties to the entry', async () => {
    const entry = await createTextCollectionEntry(
      itemsCollection.path,
      customProperties,
    );

    expect(entry.properties).toEqual(
      expect.objectContaining({ Genre: 'Non-Fiction' }),
    );
  });

  it('adds core properties to the entry', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-01-01T00:00:00Z'));

    const entry = await createTextCollectionEntry(linksCollection.path);

    expect(entry.properties).toEqual(
      expect.objectContaining({
        created: new Date('2023-01-01T00:00:00Z'),
        lastModified: new Date('2023-01-01T00:00:00Z'),
        title: i18n.t('labels.untitled'),
        note: null,
      }),
    );

    vi.useRealTimers();
  });

  it('increments the entry title to avoid file name conflicts', async () => {
    // Create a conflicting file in the collection directory
    const filePath = `${itemsCollection.path}/${itemsEntry1.properties.title}.md`;
    MockFs.addFiles([filePath]);

    const entry = await createTextCollectionEntry(
      itemsCollection.path,
      customProperties,
    );

    // The new entry should have an incremented title and path
    expect(entry.path).toBe(
      `${itemsCollection.path}/${itemsEntry1.properties.title} 1.md`,
    );
    expect(entry.properties.title).toBe(`${itemsEntry1.properties.title} 1`);
  });

  it('writes the entry file to the file system', async () => {
    const entry = await createTextCollectionEntry(
      itemsCollection.path,
      customProperties,
    );

    expect(MockFs.exists(entry.path)).toBe(true);
  });

  it('dispatches a entries create event', async () =>
    new Promise<void>((done) => {
      Events.addListener('collections:entries:create', 'test', (payload) => {
        // Payload data should be created entry
        expect(payload.data).toEqual(newEntry);
        done();
      });

      createTextCollectionEntry(itemsCollection.path, customProperties);
    }));
});
