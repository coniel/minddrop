import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { i18n } from '@minddrop/i18n';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseEntryCreatedEvent } from '../events';
import {
  MockFs,
  cleanup,
  entryStorageDatabase,
  objectDatabase,
  objectEntry1,
  setup,
} from '../test-utils';
import { DatabaseEntry } from '../types';
import { entryCorePropertiesFilePath } from '../utils';
import { createDatabaseEntry } from './createDatabaseEntry';

const title = i18n.t('labels.untitled');
const newEntry: DatabaseEntry = {
  ...objectEntry1,
  id: expect.any(String),
  title: title,
  path: `${objectDatabase.path}/${title}.md`,
  properties: {
    Content: 'Default Content',
  },
};

describe('createDatabaseEntry', () => {
  beforeEach(() => {
    setup({ loadDatabaseEntries: false });
    // Mock the Date to return a consistent value
    vi.useFakeTimers();
    vi.setSystemTime(objectEntry1.created);

    MockFs.removeFile(objectEntry1.path);
    MockFs.removeFile(entryCorePropertiesFilePath(objectEntry1.path));
  });

  afterEach(cleanup);

  it('adds the new entry to the store', async () => {
    const entry = await createDatabaseEntry(objectDatabase.id);

    const storeEntry = DatabaseEntriesStore.get(entry.id);

    expect(storeEntry).toEqual(entry);
  });

  it('writes the entry files to the file system', async () => {
    const entry = await createDatabaseEntry(objectDatabase.id);

    // Main file should exist
    expect(MockFs.exists(entry.path)).toBeTruthy();
    // Core properties YAML file should exist
    expect(MockFs.exists(entryCorePropertiesFilePath(entry.path))).toBeTruthy();
  });

  it('writes the entry file to a subdirectory if the database uses entry based storage', async () => {
    const entry = await createDatabaseEntry(entryStorageDatabase.id);

    // Main file should be written to entry subdirectory
    expect(entry.path).toBe(
      `${entryStorageDatabase.path}/${title}/${title}.md`,
    );
    expect(MockFs.exists(entry.path)).toBeTruthy();
    // Core properties should be written to the database's config directory
    expect(MockFs.exists(entryCorePropertiesFilePath(entry.path))).toBeTruthy();
  });

  it('increments the entry title if an entry with the same name exists', async () => {
    // Create two entrys with the same name
    await createDatabaseEntry(objectDatabase.id);
    const secondEntry = await createDatabaseEntry(objectDatabase.id);

    expect(secondEntry.title).toBe(`${title} 1`);
    expect(secondEntry.path).toBe(`${objectDatabase.path}/${title} 1.md`);
  });

  it('increments the entry title if an entry with the same name exists in an entry storage database', async () => {
    // Create two entrys with the same name
    await createDatabaseEntry(entryStorageDatabase.id);
    const secondEntry = await createDatabaseEntry(entryStorageDatabase.id);

    expect(secondEntry.title).toBe(`${title} 1`);
    expect(secondEntry.path).toBe(
      `${entryStorageDatabase.path}/${title} 1/${title} 1.md`,
    );
  });

  it('allows specifying a custom title', async () => {
    const customTitle = 'Custom Title';
    const entryWithCustomTitle = await createDatabaseEntry(
      objectDatabase.id,
      customTitle,
    );

    expect(entryWithCustomTitle.title).toBe(customTitle);
    expect(entryWithCustomTitle.path).toBe(
      `${objectDatabase.path}/${customTitle}.md`,
    );
  });

  it('allows specifying properties', async () => {
    const customProperties = {
      Icon: 'content-icon:shapes:blue',
    };
    const entryWithCustomProperties = await createDatabaseEntry(
      objectDatabase.id,
      title,
      customProperties,
    );

    expect(entryWithCustomProperties.properties).toEqual({
      ...newEntry.properties,
      ...customProperties,
    });
  });

  it('dispatches an entry created event', async () =>
    new Promise<void>((done) => {
      Events.addListener(DatabaseEntryCreatedEvent, 'test', (payload) => {
        // Payload data should be the new entry
        expect(payload.data).toEqual(newEntry);
        done();
      });

      createDatabaseEntry(objectDatabase.id);
    }));
});
