import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CollectionUpdatedEvent,
  CollectionUpdatedEventData,
  Collections,
} from '@minddrop/collections';
import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { onUpdateCollection } from '../event-handlers/collection-updated';
import {
  MockFs,
  cleanup,
  collectionEntry1,
  mockDate,
  objectEntry1,
  setup,
} from '../test-utils';
import { DatabaseEntry } from '../types';
import { virtualCollectionId } from '../utils';
import { clearDatabaseEntryProperty } from './clearDatabaseEntryProperty';

// Mock SQL operations since no database connection is available in tests
vi.mock('../sql', () => ({
  sqlUpsertEntries: vi.fn(),
}));

const propertyName = 'Icon';

const clearedEntry: DatabaseEntry = {
  ...objectEntry1,
  properties: { Content: objectEntry1.properties.Content },
  lastModified: mockDate,
};

describe('clearDatabaseEntryProperty', () => {
  beforeEach(setup);

  afterEach(cleanup);

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
    Events.addListener<CollectionUpdatedEventData>(
      CollectionUpdatedEvent,
      'test',
      ({ data }) => onUpdateCollection(data),
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
    expect(collection.entries).toEqual([]);
    expect(result.properties.Related).toEqual([]);
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
