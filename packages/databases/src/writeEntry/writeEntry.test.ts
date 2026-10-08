import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { NotRegisteredError } from '@minddrop/stores';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DatabasesStore } from '../DatabasesStore';
import { EntriesStore } from '../EntriesStore';
import {
  DatabaseNotFoundError,
  EntryFileUnreadableError,
  EntryNotFoundError,
} from '../errors';
import { EntryWrittenEvent, EntryWrittenEventData } from '../events';
import {
  MockFs,
  cleanup,
  collectionDatabase,
  collectionEntry1,
  entryFilePath,
  entryStorageEntry1,
  objectDatabase,
  objectEntry1,
  relatedEntry1,
  relatedEntry2,
  setup,
  yamlObjectEntry1,
} from '../test-utils';
import { entryAddress, resolveDatabasePath, resolveEntryPath } from '../utils';
import { writeEntry } from './writeEntry';

const { workspace_2 } = WorkspaceFixtures;

describe('writeEntry', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the entry does not exist', async () => {
    await expect(writeEntry('non-existent-entry')).rejects.toThrow(
      EntryNotFoundError,
    );
  });

  it('throws if the entry database does not exist', async () => {
    EntriesStore.clear();
    // Add an entry with a non-existent database
    EntriesStore.set({
      ...objectEntry1,
      database: 'database_non-existent',
    });

    await expect(writeEntry(objectEntry1.id)).rejects.toThrow(
      DatabaseNotFoundError,
    );
  });

  it('throws if the entry serializer is not registered', async () => {
    EntriesStore.clear();
    // Add a database with a non-existent entry serializer
    DatabasesStore.set({
      ...objectDatabase,
      id: 'database_missing-serializer',
      entrySerializer: 'non-existent-entry-serializer',
    });
    // Add an entry with a non-existent entry serializer
    EntriesStore.set({
      ...objectEntry1,
      database: 'database_missing-serializer',
    });

    await expect(writeEntry(objectEntry1.id)).rejects.toThrow(
      NotRegisteredError,
    );
  });

  it('dispatches the written event with the contents either side of the write', async () => {
    let data: EntryWrittenEventData | null = null;

    Events.addListener(EntryWrittenEvent, 'test', (eventData) => {
      data = eventData;
    });

    MockFs.writeTextFile(
      entryFilePath(objectEntry1),
      'The contents the write replaced',
    );

    await writeEntry(objectEntry1.id);

    expect(data).toEqual({
      entry: objectEntry1,
      database: objectDatabase,
      previousContents: 'The contents the write replaced',
      contents: MockFs.readTextFile(entryFilePath(objectEntry1)),
    });
  });

  it('dispatches the written event without previous contents for a new file', async () => {
    let data: EntryWrittenEventData | null = null;

    Events.addListener(EntryWrittenEvent, 'test', (eventData) => {
      data = eventData;
    });

    MockFs.removeFile(entryFilePath(objectEntry1));

    await writeEntry(objectEntry1.id);

    expect(data).toHaveProperty('previousContents', undefined);
  });

  it('does not write when the file already holds the serialized entry', async () => {
    let dispatched = false;

    // Write once so the file holds what a second write would produce
    await writeEntry(objectEntry1.id);

    const contents = MockFs.readTextFile(entryFilePath(objectEntry1));

    Events.addListener(EntryWrittenEvent, 'test', () => {
      dispatched = true;
    });

    await writeEntry(objectEntry1.id);

    expect(dispatched).toBe(false);
    expect(MockFs.readTextFile(entryFilePath(objectEntry1))).toBe(contents);
  });

  it('does not overwrite an entry file which cannot be deserialized', async () => {
    // An entry file broken outside the app since the entry was read
    const brokenContents = 'Title: Test Entry\nIcon: Nested: mapping\n';

    MockFs.writeTextFile(entryFilePath(yamlObjectEntry1), brokenContents);

    await expect(writeEntry(yamlObjectEntry1.id)).rejects.toThrow(
      EntryFileUnreadableError,
    );
    expect(MockFs.readTextFile(entryFilePath(yamlObjectEntry1))).toBe(
      brokenContents,
    );
  });

  it('ensures the entry subdirectory exists if the database uses entry based storage', async () => {
    const path = entryFilePath(entryStorageEntry1);
    const parentDir = path.substring(0, path.lastIndexOf('/'));

    // Remove the entry subdirectory before writing to ensure it doesn't exist
    MockFs.removeFile(parentDir);

    await writeEntry(entryStorageEntry1.id);

    expect(MockFs.exists(parentDir)).toBe(true);
  });

  it('writes the user properties to the entry file', async () => {
    // Remove the file before writing to ensure it doesn't exist
    MockFs.removeFile(entryFilePath(yamlObjectEntry1));

    await writeEntry(yamlObjectEntry1.id);

    const properties = await MockFs.readYamlFile(
      entryFilePath(yamlObjectEntry1),
    );

    expect(properties).toEqual(yamlObjectEntry1.properties);
  });

  it('writes collection property members as addresses', async () => {
    await writeEntry(collectionEntry1.id);

    const contents = MockFs.readTextFile(entryFilePath(collectionEntry1));

    // Member references should be written as durable addresses rather
    // than entry IDs.
    expect(contents).toContain(entryAddress(relatedEntry1));
    expect(contents).toContain(entryAddress(relatedEntry2));
    expect(contents).not.toContain(relatedEntry1.id);
  });

  describe('preserving unmodelled frontmatter', () => {
    it('preserves keys absent from the database schema', async () => {
      // An entry whose file carries a key the database does not model,
      // as though the user had added it in another editor
      MockFs.writeTextFile(
        entryFilePath(objectEntry1),
        `---\nIcon: ${objectEntry1.properties.Icon}\ncustom: keep me\n---\n\nTest content`,
      );

      await writeEntry(objectEntry1.id);

      expect(MockFs.readTextFile(entryFilePath(objectEntry1))).toContain(
        'custom: keep me',
      );
    });

    it('preserves comments', async () => {
      MockFs.writeTextFile(
        entryFilePath(objectEntry1),
        `---\n# a comment\nIcon: ${objectEntry1.properties.Icon}\n---\n\nTest content`,
      );

      await writeEntry(objectEntry1.id);

      expect(MockFs.readTextFile(entryFilePath(objectEntry1))).toContain(
        '# a comment',
      );
    });

    it('preserves the formatting of untouched keys', async () => {
      MockFs.writeTextFile(
        entryFilePath(objectEntry1),
        `---\nIcon: "${objectEntry1.properties.Icon}"\nnotes: |\n  first\n  second\n---\n\nTest content`,
      );

      await writeEntry(objectEntry1.id);

      const contents = MockFs.readTextFile(entryFilePath(objectEntry1));

      expect(contents).toContain(`Icon: "${objectEntry1.properties.Icon}"`);
      expect(contents).toContain('notes: |');
    });

    it('preserves unmodelled keys after a restart has dropped them from the store', async () => {
      // The SQL index only carries schema properties, so after a restart the
      // in-memory entry has no knowledge of the user's own frontmatter keys.
      EntriesStore.update(objectEntry1.id, {
        properties: {
          Content: 'Test content',
          Icon: 'lucide:shapes:blue',
        },
      });
      MockFs.writeTextFile(
        entryFilePath(objectEntry1),
        `---\nIcon: ${objectEntry1.properties.Icon}\ncustom: keep me\n---\n\nTest content`,
      );

      await writeEntry(objectEntry1.id);

      expect(MockFs.readTextFile(entryFilePath(objectEntry1))).toContain(
        'custom: keep me',
      );
    });
  });

  it('omits collection members that do not resolve', async () => {
    // Reference a non-existent entry
    EntriesStore.update(collectionEntry1.id, {
      properties: {
        ...collectionEntry1.properties,
        Related: ['database-entry_missing'],
      },
    });

    await writeEntry(collectionEntry1.id);

    const contents = MockFs.readTextFile(entryFilePath(collectionEntry1));

    expect(contents).not.toContain('database-entry_missing');
  });

  it("writes the entry into the given workspace's database directory", async () => {
    // The database and its entries held by the second workspace as well
    DatabasesStore.in(workspace_2.id).set(collectionDatabase);
    EntriesStore.in(workspace_2.id).load([
      collectionEntry1,
      relatedEntry1,
      relatedEntry2,
    ]);
    MockFs.createDir(
      resolveDatabasePath(collectionDatabase, workspace_2.path),
      {
        recursive: true,
      },
    );

    await writeEntry(collectionEntry1.id, {
      workspaceId: workspace_2.id,
    });

    const contents = MockFs.readTextFile(
      resolveEntryPath(collectionEntry1, collectionDatabase, workspace_2.path),
    );

    // The file is written under the second workspace, with its
    // references serialized from that workspace's entries.
    expect(contents).toContain(entryAddress(relatedEntry1, collectionDatabase));
  });
});
