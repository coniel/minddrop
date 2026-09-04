import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Collections } from '@minddrop/collections';
import { Events } from '@minddrop/events';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseEntryNotFoundError } from '../errors';
import { DatabaseEntryDuplicatedEvent } from '../events';
import {
  MockFs,
  cleanup,
  commonStorageDatabase,
  commonStorageEntry1,
  entryStorageDatabase,
  entryStorageEntry1,
  mockDate,
  objectDatabase,
  objectEntry1,
  rootStorageDatabase,
  rootStorageEntry1,
  setup,
} from '../test-utils';
import { DatabaseEntryMetadata } from '../types';
import { duplicateDatabaseEntry } from './duplicateDatabaseEntry';

describe('duplicateDatabaseEntry', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the entry does not exist', async () => {
    // Duplicating a missing entry should throw
    await expect(duplicateDatabaseEntry('missing')).rejects.toThrow(
      DatabaseEntryNotFoundError,
    );
  });

  it('creates a new entry with an incremented title', async () => {
    const duplicate = await duplicateDatabaseEntry(objectEntry1.id);

    // The duplicate should be a new entry with an incremented title
    expect(duplicate.id).not.toBe(objectEntry1.id);
    expect(duplicate.title).toBe('Test Entry 1');
    // The duplicate's file should be written next to the source file
    expect(MockFs.exists(`${objectDatabase.path}/Test Entry 1.md`)).toBe(true);
    // The duplicate should be in the store
    expect(DatabaseEntriesStore.get(duplicate.id)).not.toBeNull();
  });

  it('leaves the source entry intact', async () => {
    await duplicateDatabaseEntry(objectEntry1.id);

    // The source entry and its file should be untouched
    expect(DatabaseEntriesStore.get(objectEntry1.id)).toEqual(objectEntry1);
    expect(MockFs.exists(objectEntry1.path)).toBe(true);
  });

  it('copies simple property values onto the duplicate', async () => {
    const duplicate = await duplicateDatabaseEntry(objectEntry1.id);

    // The source entry's simple values should be copied as is
    expect(duplicate.properties.Content).toBe('Test content');
    expect(duplicate.properties.Icon).toBe('content-icon:shapes:blue');
  });

  it('sets fresh timestamps on the duplicate', async () => {
    const duplicate = await duplicateDatabaseEntry(objectEntry1.id);

    // The duplicate should not inherit the source entry's timestamps
    expect(duplicate.created).toEqual(mockDate);
    expect(duplicate.lastModified).toEqual(mockDate);
  });

  it('copies loose property files for root storage', async () => {
    const duplicate = await duplicateDatabaseEntry(rootStorageEntry1.id);

    // The file should be copied with an incremented name
    expect(duplicate.properties.Image).toBe('image 1.png');
    expect(MockFs.exists(`${rootStorageDatabase.path}/image 1.png`)).toBe(true);
    // The source file should remain in place
    expect(MockFs.exists(`${rootStorageDatabase.path}/image.png`)).toBe(true);
  });

  it('copies property files into shared property directories', async () => {
    const duplicate = await duplicateDatabaseEntry(commonStorageEntry1.id);

    // The file should be copied into the shared directory with an
    // incremented name
    expect(duplicate.properties.Image).toBe('image 1.png');
    expect(
      MockFs.exists(
        `${commonStorageDatabase.path}/${commonStorageDatabase.propertyFilesDir}/image 1.png`,
      ),
    ).toBe(true);
  });

  it('copies property files into the duplicate subdirectory for entry-based storage', async () => {
    const duplicate = await duplicateDatabaseEntry(entryStorageEntry1.id);

    // The duplicate should get its own subdirectory
    expect(duplicate.title).toBe('Entry Storage Entry 1 1');
    // The file keeps its name since the duplicate's subdirectory is empty
    expect(duplicate.properties.Image).toBe('image.png');
    expect(
      MockFs.exists(
        `${entryStorageDatabase.path}/Entry Storage Entry 1 1/image.png`,
      ),
    ).toBe(true);
  });

  it('skips file based properties whose source file is missing', async () => {
    // Remove the source entry's stored image file
    MockFs.removeFile(`${rootStorageDatabase.path}/image.png`);

    const duplicate = await duplicateDatabaseEntry(rootStorageEntry1.id);

    // The duplicate should be created without the image property value
    expect(duplicate.properties.Image).toBeUndefined();
  });

  it('copies the source entry metadata onto the duplicate', async () => {
    const metadata: DatabaseEntryMetadata = {
      embeddedViewConfigs: {
        'layout-1:Content': { options: { sortBy: 'title' } },
      },
    };

    // Set up metadata on the source entry
    DatabaseEntriesStore.update(objectEntry1.id, { metadata });

    const duplicate = await duplicateDatabaseEntry(objectEntry1.id);

    // The duplicate should have the source entry's metadata
    expect(duplicate.metadata).toEqual(metadata);
  });

  it('adds the duplicate to the source collection', async () => {
    // Set up a collection containing the source entry
    Collections.createVirtual('collection-1', 'Collection 1', [
      objectEntry1.id,
    ]);

    const duplicate = await duplicateDatabaseEntry(objectEntry1.id, {
      type: 'collection',
      id: 'collection-1',
    });

    // The duplicate should be added to the collection
    expect(Collections.get('collection-1').items).toContain(duplicate.id);
  });

  it('leaves collections untouched for non-collection sources', async () => {
    // Set up a collection containing the source entry
    Collections.createVirtual('collection-1', 'Collection 1', [
      objectEntry1.id,
    ]);

    await duplicateDatabaseEntry(objectEntry1.id, {
      type: 'database',
      id: objectDatabase.id,
    });

    // The collection should only contain the source entry
    expect(Collections.get('collection-1').items).toEqual([objectEntry1.id]);
  });

  it('dispatches an entry duplicated event', async () =>
    new Promise<void>((done) => {
      Events.addListener(DatabaseEntryDuplicatedEvent, 'test', (data) => {
        // Payload should contain the original, the duplicate,
        // and the source
        expect(data.original).toEqual(objectEntry1);
        expect(data.duplicate.title).toBe('Test Entry 1');
        expect(data.source).toEqual({
          type: 'database',
          id: objectDatabase.id,
        });
        done();
      });

      duplicateDatabaseEntry(objectEntry1.id, {
        type: 'database',
        id: objectDatabase.id,
      });
    }));
});
