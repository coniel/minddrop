import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { i18n } from '@minddrop/i18n';
import { EntriesStore } from '../EntriesStore';
import { EntryCreatedEvent } from '../events';
import { readEntryMetadata } from '../readEntryMetadata';
import {
  MockFs,
  cleanup,
  databaseDirPath,
  entryFilePath,
  entryStorageDatabase,
  objectDatabase,
  objectEntry1,
  setup,
  timestampDatabase,
} from '../test-utils';
import { Entry } from '../types';
import { resolveEntryPath } from '../utils';
import { createEntry } from './createEntry';

const title = i18n.t('labels.untitled');
const newEntry: Entry = {
  ...objectEntry1,
  title: title,
  path: `${title}.md`,
  properties: {
    Content: 'Default Content',
  },
  metadata: {
    created: objectEntry1.created,
    lastModified: objectEntry1.created,
  },
};

describe('createEntry', () => {
  beforeEach(() => {
    setup({ loadEntries: false });
    // Mock the Date to return a consistent value
    vi.useFakeTimers();
    vi.setSystemTime(objectEntry1.created);

    MockFs.removeFile(entryFilePath(objectEntry1));
  });

  afterEach(cleanup);

  it('adds the new entry to the store', async () => {
    const entry = await createEntry(objectDatabase.id);

    const storeEntry = EntriesStore.get(entry.id);

    expect(storeEntry).toEqual(entry);
  });

  it('writes the entry file to the file system', async () => {
    const entry = await createEntry(objectDatabase.id);

    // Entry file should exist
    expect(MockFs.exists(resolveEntryPath(entry, objectDatabase))).toBeTruthy();
  });

  it('writes the entry file to a subdirectory if the database uses entry based storage', async () => {
    const entry = await createEntry(entryStorageDatabase.id);

    // Main file should be written to entry subdirectory
    expect(entry.path).toBe(`${title}/${title}.md`);
    expect(
      MockFs.exists(resolveEntryPath(entry, entryStorageDatabase)),
    ).toBeTruthy();
  });

  it('increments the entry title if an entry with the same name exists', async () => {
    // Create two entries with the same name
    const firstEntry = await createEntry(objectDatabase.id);
    const secondEntry = await createEntry(objectDatabase.id);

    expect(secondEntry.title).toBe(`${title} 1`);
    expect(secondEntry.id).not.toBe(firstEntry.id);
    expect(secondEntry.path).toBe(`${title} 1.md`);
  });

  it('increments the entry title if an entry with the same name exists in an entry storage database', async () => {
    // Create two entries with the same name
    await createEntry(entryStorageDatabase.id);
    const secondEntry = await createEntry(entryStorageDatabase.id);

    expect(secondEntry.title).toBe(`${title} 1`);
    expect(secondEntry.path).toBe(`${title} 1/${title} 1.md`);
  });

  it('allows specifying a custom title', async () => {
    const customTitle = 'Custom Title';
    const entryWithCustomTitle = await createEntry(
      objectDatabase.id,
      customTitle,
    );

    expect(entryWithCustomTitle.title).toBe(customTitle);
    expect(entryWithCustomTitle.path).toBe(`${customTitle}.md`);
  });

  it('allows specifying properties', async () => {
    const customProperties = {
      Icon: 'lucide:shapes:blue',
    };
    const entryWithCustomProperties = await createEntry(
      objectDatabase.id,
      title,
      customProperties,
    );

    expect(entryWithCustomProperties.properties).toEqual({
      ...newEntry.properties,
      ...customProperties,
    });
  });

  it('sets the created and last-modified timestamp property values', async () => {
    const entry = await createEntry(timestampDatabase.id);

    expect(entry.properties.Created).toEqual(objectEntry1.created);
    expect(entry.properties['Last Modified']).toEqual(objectEntry1.created);
  });

  it('writes the timestamps to the entry metadata sidecar', async () => {
    const entry = await createEntry(objectDatabase.id);

    const metadata = await readEntryMetadata(
      databaseDirPath(objectDatabase),
      entry.path,
    );

    expect(metadata.created).toEqual(objectEntry1.created);
    expect(metadata.lastModified).toEqual(objectEntry1.created);
  });

  it('dispatches an entry created event', async () =>
    new Promise<void>((done) => {
      Events.addListener(EntryCreatedEvent, 'test', (payload) => {
        // Payload data should be the new entry
        expect(payload).toEqual({ ...newEntry, id: expect.any(String) });
        done();
      });

      createEntry(objectDatabase.id);
    }));
});
