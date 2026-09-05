import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabasesStore } from '../DatabasesStore';
import {
  DatabaseEntryNotFoundError,
  DatabaseEntrySerializerNotRegisteredError,
  DatabaseNotFoundError,
} from '../errors';
import {
  DatabaseEntryWrittenEvent,
  DatabaseEntryWrittenEventData,
} from '../events';
import {
  MockFs,
  cleanup,
  collectionEntry1,
  entryStorageEntry1,
  objectDatabase,
  objectEntry1,
  relatedEntry1,
  relatedEntry2,
  setup,
  yamlObjectEntry1,
} from '../test-utils';
import { databaseEntryAddress } from '../utils';
import { writeDatabaseEntry } from './writeDatabaseEntry';

describe('writeDatabaseEntry', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the entry does not exist', async () => {
    await expect(writeDatabaseEntry('non-existent-entry')).rejects.toThrow(
      DatabaseEntryNotFoundError,
    );
  });

  it('throws if the entry database does not exist', async () => {
    DatabaseEntriesStore.clear();
    // Add an entry with a non-existent database
    DatabaseEntriesStore.set({
      ...objectEntry1,
      database: 'database_non-existent',
    });

    await expect(writeDatabaseEntry(objectEntry1.id)).rejects.toThrow(
      DatabaseNotFoundError,
    );
  });

  it('throws if the entry serializer is not registered', async () => {
    DatabaseEntriesStore.clear();
    // Add a database with a non-existent entry serializer
    DatabasesStore.set({
      ...objectDatabase,
      id: 'database_missing-serializer',
      entrySerializer: 'non-existent-entry-serializer',
    });
    // Add an entry with a non-existent entry serializer
    DatabaseEntriesStore.set({
      ...objectEntry1,
      database: 'database_missing-serializer',
    });

    await expect(writeDatabaseEntry(objectEntry1.id)).rejects.toThrow(
      DatabaseEntrySerializerNotRegisteredError,
    );
  });

  it('dispatches the written event with the contents either side of the write', async () => {
    let data: DatabaseEntryWrittenEventData | null = null;

    Events.addListener(DatabaseEntryWrittenEvent, 'test', (eventData) => {
      data = eventData;
    });

    MockFs.writeTextFile(objectEntry1.path, 'The contents the write replaced');

    await writeDatabaseEntry(objectEntry1.id);

    expect(data).toEqual({
      entry: objectEntry1,
      database: objectDatabase,
      previousContents: 'The contents the write replaced',
      contents: MockFs.readTextFile(objectEntry1.path),
    });
  });

  it('dispatches the written event without previous contents for a new file', async () => {
    let data: DatabaseEntryWrittenEventData | null = null;

    Events.addListener(DatabaseEntryWrittenEvent, 'test', (eventData) => {
      data = eventData;
    });

    MockFs.removeFile(objectEntry1.path);

    await writeDatabaseEntry(objectEntry1.id);

    expect(data).toHaveProperty('previousContents', undefined);
  });

  it('does not write when the file already holds the serialized entry', async () => {
    let dispatched = false;

    // Write once so the file holds what a second write would produce
    await writeDatabaseEntry(objectEntry1.id);

    const contents = MockFs.readTextFile(objectEntry1.path);

    Events.addListener(DatabaseEntryWrittenEvent, 'test', () => {
      dispatched = true;
    });

    await writeDatabaseEntry(objectEntry1.id);

    expect(dispatched).toBe(false);
    expect(MockFs.readTextFile(objectEntry1.path)).toBe(contents);
  });

  it('ensures the entry subdirectory exists if the database uses entry based storage', async () => {
    const path = entryStorageEntry1.path;
    const parentDir = path.substring(0, path.lastIndexOf('/'));

    // Remove the entry subdirectory before writing to ensure it doesn't exist
    MockFs.removeFile(parentDir);

    await writeDatabaseEntry(entryStorageEntry1.id);

    expect(MockFs.exists(parentDir)).toBe(true);
  });

  it('writes the user properties to the entry file', async () => {
    // Remove the file before writing to ensure it doesn't exist
    MockFs.removeFile(yamlObjectEntry1.path);

    await writeDatabaseEntry(yamlObjectEntry1.id);

    const properties = await MockFs.readYamlFile(yamlObjectEntry1.path);

    expect(properties).toEqual(yamlObjectEntry1.properties);
  });

  it('writes collection property members as addresses', async () => {
    await writeDatabaseEntry(collectionEntry1.id);

    const contents = MockFs.readTextFile(collectionEntry1.path);

    // Member references should be written as durable addresses rather
    // than entry IDs
    expect(contents).toContain(databaseEntryAddress(relatedEntry1));
    expect(contents).toContain(databaseEntryAddress(relatedEntry2));
    expect(contents).not.toContain(relatedEntry1.id);
  });

  describe('preserving unmodelled frontmatter', () => {
    it('preserves keys absent from the database schema', async () => {
      // An entry whose file carries a key the database does not model,
      // as though the user had added it in another editor
      MockFs.writeTextFile(
        objectEntry1.path,
        `---\nIcon: ${objectEntry1.properties.Icon}\ncustom: keep me\n---\n\nTest content`,
      );

      await writeDatabaseEntry(objectEntry1.id);

      expect(MockFs.readTextFile(objectEntry1.path)).toContain(
        'custom: keep me',
      );
    });

    it('preserves comments', async () => {
      MockFs.writeTextFile(
        objectEntry1.path,
        `---\n# a comment\nIcon: ${objectEntry1.properties.Icon}\n---\n\nTest content`,
      );

      await writeDatabaseEntry(objectEntry1.id);

      expect(MockFs.readTextFile(objectEntry1.path)).toContain('# a comment');
    });

    it('preserves the formatting of untouched keys', async () => {
      MockFs.writeTextFile(
        objectEntry1.path,
        `---\nIcon: "${objectEntry1.properties.Icon}"\nnotes: |\n  first\n  second\n---\n\nTest content`,
      );

      await writeDatabaseEntry(objectEntry1.id);

      const contents = MockFs.readTextFile(objectEntry1.path);

      expect(contents).toContain(`Icon: "${objectEntry1.properties.Icon}"`);
      expect(contents).toContain('notes: |');
    });

    it('preserves unmodelled keys after a restart has dropped them from the store', async () => {
      // The SQL index only carries schema properties, so after a restart the
      // in-memory entry has no knowledge of the user's own frontmatter keys
      DatabaseEntriesStore.update(objectEntry1.id, {
        properties: {
          Content: 'Test content',
          Icon: 'content-icon:shapes:blue',
        },
      });
      MockFs.writeTextFile(
        objectEntry1.path,
        `---\nIcon: ${objectEntry1.properties.Icon}\ncustom: keep me\n---\n\nTest content`,
      );

      await writeDatabaseEntry(objectEntry1.id);

      expect(MockFs.readTextFile(objectEntry1.path)).toContain(
        'custom: keep me',
      );
    });
  });

  it('omits collection members that do not resolve', async () => {
    // Reference a non-existent entry
    DatabaseEntriesStore.update(collectionEntry1.id, {
      properties: {
        ...collectionEntry1.properties,
        Related: ['database-entry_missing'],
      },
    });

    await writeDatabaseEntry(collectionEntry1.id);

    const contents = MockFs.readTextFile(collectionEntry1.path);

    expect(contents).not.toContain('database-entry_missing');
  });
});
