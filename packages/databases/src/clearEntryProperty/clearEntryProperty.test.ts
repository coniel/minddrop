import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Collections } from '@minddrop/collections';
import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { EntriesStore } from '../EntriesStore';
import { onUpdateCollection } from '../event-handlers/collection-updated';
import { readEntryMetadata } from '../readEntryMetadata';
import { sqlGetEntriesFull, sqlUpsertDatabase } from '../sql';
import {
  MockFs,
  cleanup,
  cleanupTestSqlDatabase,
  collectionDatabase,
  collectionEntry1,
  databaseDirPath,
  entryFilePath,
  mockDate,
  objectDatabase,
  objectEntry1,
  setup,
  setupTestSqlDatabase,
} from '../test-utils';
import { Entry } from '../types';
import { virtualCollectionId } from '../utils';
import { clearEntryProperty } from './clearEntryProperty';

const propertyName = 'Icon';

const clearedEntry: Entry = {
  ...objectEntry1,
  properties: { Content: objectEntry1.properties.Content },
  lastModified: mockDate,
};

describe('clearEntryProperty', () => {
  beforeEach(() => {
    setup();

    // Open an in-memory SQL database
    setupTestSqlDatabase();

    // Seed the collection database record so the collection
    // write-back handler can upsert its entries.
    sqlUpsertDatabase(
      {
        id: collectionDatabase.id,
        name: collectionDatabase.name,
        path: collectionDatabase.path,
        icon: collectionDatabase.icon,
        properties: collectionDatabase.properties,
      },
      { silent: true },
    );
  });

  afterEach(async () => {
    cleanupTestSqlDatabase();
    await cleanup();
  });

  it('throws if the property does not exist on the database', async () => {
    await expect(
      clearEntryProperty(objectEntry1.id, 'NonExistent'),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('clears collection properties through the virtual collection', async () => {
    // Create the virtual collection for the Related property
    Collections.createVirtual(
      virtualCollectionId(collectionEntry1.id, 'Related'),
      'Related',
      collectionEntry1.properties.Related as string[],
    );

    // Register the collection write-back handler
    Events.addListener(Collections.events.Updated, 'test', (data) =>
      onUpdateCollection(data),
    );

    const result = await clearEntryProperty(collectionEntry1.id, 'Related');

    // Both the virtual collection and the entry property
    // should be emptied.
    const collection = Collections.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );
    expect(collection.items).toEqual([]);
    expect(result.properties.Related).toEqual([]);

    // The collection write-back lands as an unawaited event side
    // effect, so poll for the re-upserted SQL record.
    await vi.waitFor(() => {
      const record = sqlGetEntriesFull().find(
        (entryRecord) => entryRecord.id === collectionEntry1.id,
      )!;

      // The cleared property should have no SQL value rows left
      expect(record.properties).not.toContainEqual(
        expect.objectContaining({ name: 'Related' }),
      );
      // Other collection properties should keep their value rows
      expect(record.properties).toContainEqual(
        expect.objectContaining({
          name: 'References',
          value: collectionEntry1.properties.References,
        }),
      );
    });
  });

  it('removes the property from the entry', async () => {
    const result = await clearEntryProperty(objectEntry1.id, propertyName);

    expect(result).toEqual(clearedEntry);
    expect(result.properties).not.toHaveProperty(propertyName);
  });

  it('updates the entry in the store', async () => {
    await clearEntryProperty(objectEntry1.id, propertyName);

    expect(EntriesStore).toHaveItem(objectEntry1.id, clearedEntry);
  });

  it('writes the updated entry to the file system', async () => {
    await clearEntryProperty(objectEntry1.id, propertyName);

    const result = MockFs.readTextFile(entryFilePath(objectEntry1));

    expect(result).not.toContain(propertyName);
  });

  it("drops the property's metadata", async () => {
    // Give the cleared and another property metadata
    EntriesStore.update(objectEntry1.id, {
      metadata: {
        properties: {
          [propertyName]: { crop: 'square' },
          Content: { page: 3 },
        },
      },
    });

    const result = await clearEntryProperty(objectEntry1.id, propertyName);

    expect(result.metadata.properties).toEqual({ Content: { page: 3 } });

    const metadata = await readEntryMetadata(
      databaseDirPath(objectDatabase),
      result.path,
    );

    expect(metadata.properties).toEqual({ Content: { page: 3 } });
  });
});
