import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { EntriesStore } from '../EntriesStore';
import { EntryNotFoundError } from '../errors';
import { EntryUpdatedEvent } from '../events';
import { readEntryMetadata } from '../readEntryMetadata';
import {
  DatabaseFixtures,
  MockFs,
  cleanup,
  databaseDirPath,
  entryFilePath,
  objectDatabase,
  objectEntry1,
  setup,
  timestampEntry1,
} from '../test-utils';
import { resolveEntryMetadataFilePath } from '../utils';
import { updateEntry } from './updateEntry';

const { collectionEntry1, relatedEntry1, relatedEntry2 } = DatabaseFixtures;

const update = {
  properties: {
    Content: 'Updated content',
  },
};

describe('updateEntry', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('should update the entry with the provided data', async () => {
    const entry = await updateEntry(objectEntry1.id, update);

    expect(entry.properties.Content).toBe(update.properties.Content);
  });

  it('throws if the entry does not exist', async () => {
    await expect(
      updateEntry('non/existent/Entry.md', update),
    ).rejects.toThrowError(EntryNotFoundError);
  });

  it('updates the last modified date', async () => {
    const entry = await updateEntry(objectEntry1.id, update);

    expect(entry.lastModified.getTime()).toBeGreaterThan(
      objectEntry1.lastModified.getTime(),
    );
  });

  it('updates the last-modified timestamp property value', async () => {
    const entry = await updateEntry(timestampEntry1.id, update);

    // Last Modified property value should match the new lastModified date
    expect(entry.properties['Last Modified']).toEqual(entry.lastModified);
    // Created property value should be left untouched
    expect(entry.properties.Created).toEqual(
      timestampEntry1.properties.Created,
    );
  });

  it('writes the last modified date to the entry metadata sidecar', async () => {
    const entry = await updateEntry(objectEntry1.id, update);

    const metadata = await readEntryMetadata(
      databaseDirPath(objectDatabase),
      entry.path,
    );

    expect(metadata.lastModified).toEqual(entry.lastModified);
  });

  it('updates the entry in the store', async () => {
    const entry = await updateEntry(objectEntry1.id, update);

    const storeEntry = EntriesStore.get(objectEntry1.id);

    expect(storeEntry).toEqual(entry);
  });

  it('writes the entry files to the file system', async () => {
    // Delete the exisitng entry file
    MockFs.removeFile(entryFilePath(objectEntry1));

    await updateEntry(objectEntry1.id, update);

    expect(MockFs.exists(entryFilePath(objectEntry1))).toBeTruthy();
  });

  it('does nothing if no valid update data is provided', async () => {
    const entry = await updateEntry(objectEntry1.id, {});

    expect(entry).toEqual(objectEntry1);
  });

  describe('given values the entry already has', () => {
    const repeatedUpdate = {
      properties: { Content: objectEntry1.properties.Content },
    };

    it('leaves the entry in the store unchanged', async () => {
      await updateEntry(objectEntry1.id, repeatedUpdate);

      expect(EntriesStore).toHaveItem(objectEntry1.id, objectEntry1);
    });

    it('does not write the entry file', async () => {
      MockFs.removeFile(entryFilePath(objectEntry1));

      await updateEntry(objectEntry1.id, repeatedUpdate);

      expect(MockFs.exists(entryFilePath(objectEntry1))).toBeFalsy();
    });

    it('does not write the entry metadata sidecar', async () => {
      await updateEntry(objectEntry1.id, repeatedUpdate);

      expect(
        MockFs.exists(
          resolveEntryMetadataFilePath(
            databaseDirPath(objectDatabase),
            objectEntry1.path,
          ),
        ),
      ).toBeFalsy();
    });

    it('does not dispatch an entry updated event', async () => {
      let dispatched = false;

      Events.addListener(EntryUpdatedEvent, 'test', () => {
        dispatched = true;
      });

      await updateEntry(objectEntry1.id, repeatedUpdate);
      await Events.tests.awaitAllListeners();

      expect(dispatched).toBe(false);
    });

    it('treats an equal list as no change', async () => {
      await updateEntry(collectionEntry1.id, {
        properties: { Related: [relatedEntry1.id, relatedEntry2.id] },
      });

      expect(EntriesStore).toHaveItem(collectionEntry1.id, collectionEntry1);
    });

    it('treats a new timestamp property value as no change', async () => {
      await updateEntry(timestampEntry1.id, {
        properties: { 'Last Modified': new Date() },
      });

      expect(EntriesStore).toHaveItem(timestampEntry1.id, timestampEntry1);
    });
  });

  it('dispatches a entry update event', async () =>
    new Promise<void>((done) => {
      Events.addListener(EntryUpdatedEvent, 'test', (payload) => {
        // Payload data should cotain the original and updated entry
        expect(payload).toEqual({
          original: objectEntry1,
          updated: {
            ...objectEntry1,
            lastModified: expect.any(Date),
            metadata: { lastModified: expect.any(Date) },
            properties: {
              ...objectEntry1.properties,
              ...update.properties,
            },
          },
        });
        done();
      });

      updateEntry(objectEntry1.id, update);
    }));

  it('drops the metadata of the properties given a different value', async () => {
    // Give the changed and an unchanged property metadata
    EntriesStore.update(objectEntry1.id, {
      metadata: {
        properties: { Content: { page: 3 }, Icon: { crop: 'square' } },
      },
    });

    const entry = await updateEntry(objectEntry1.id, {
      properties: {
        Content: 'Updated content',
        Icon: objectEntry1.properties.Icon,
      },
    });

    // The changed property's metadata is gone, the unchanged one's kept
    expect(entry.metadata.properties).toEqual({ Icon: { crop: 'square' } });

    const metadata = await readEntryMetadata(
      databaseDirPath(objectDatabase),
      entry.path,
    );

    expect(metadata.properties).toEqual({ Icon: { crop: 'square' } });
  });
});
