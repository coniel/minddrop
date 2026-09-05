import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CollectionUpdatedEvent, Collections } from '@minddrop/collections';
import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { onUpdateCollection } from '../event-handlers/collection-updated';
import { sqlGetAllEntriesFull, sqlUpsertDatabase } from '../sql';
import {
  MockFs,
  cleanup,
  cleanupTestSqlDatabase,
  collectionDatabase,
  collectionEntry1,
  mockDate,
  objectEntry1,
  setup,
  setupTestSqlDatabase,
} from '../test-utils';
import { DatabaseEntry } from '../types';
import { virtualCollectionId } from '../utils';
import { clearDatabaseEntryProperty } from './clearDatabaseEntryProperty';

const propertyName = 'Icon';

const clearedEntry: DatabaseEntry = {
  ...objectEntry1,
  properties: { Content: objectEntry1.properties.Content },
  lastModified: mockDate,
};

describe('clearDatabaseEntryProperty', () => {
  beforeEach(() => {
    setup();

    // Open an in-memory SQL database
    setupTestSqlDatabase();

    // Seed the collection database record so the collection
    // write-back handler can upsert its entries
    sqlUpsertDatabase(
      {
        id: collectionDatabase.id,
        name: collectionDatabase.name,
        path: collectionDatabase.path,
        icon: collectionDatabase.icon,
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
      clearDatabaseEntryProperty(objectEntry1.id, 'NonExistent'),
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
    Events.addListener(CollectionUpdatedEvent, 'test', (data) =>
      onUpdateCollection(data),
    );

    const result = await clearDatabaseEntryProperty(
      collectionEntry1.id,
      'Related',
    );

    // Both the virtual collection and the entry property
    // should be emptied
    const collection = Collections.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );
    expect(collection.items).toEqual([]);
    expect(result.properties.Related).toEqual([]);

    // The collection write-back lands as an unawaited event side
    // effect, so poll for the re-upserted SQL record.
    await vi.waitFor(() => {
      const record = sqlGetAllEntriesFull().find(
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
    const result = await clearDatabaseEntryProperty(
      objectEntry1.id,
      propertyName,
    );

    expect(result).toEqual(clearedEntry);
    expect(result.properties).not.toHaveProperty(propertyName);
  });

  it('updates the entry in the store', async () => {
    await clearDatabaseEntryProperty(objectEntry1.id, propertyName);

    expect(DatabaseEntriesStore.get(objectEntry1.id)).toEqual(clearedEntry);
  });

  it('writes the updated entry to the file system', async () => {
    await clearDatabaseEntryProperty(objectEntry1.id, propertyName);

    const result = MockFs.readTextFile(objectEntry1.path);

    expect(result).not.toContain(propertyName);
  });
});
