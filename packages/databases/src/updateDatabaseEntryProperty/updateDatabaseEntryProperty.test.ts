import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CollectionUpdatedEvent, Collections } from '@minddrop/collections';
import { Events } from '@minddrop/events';
import { InvalidParameterError, isUntitledTitle } from '@minddrop/utils';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { onUpdateCollection } from '../event-handlers/collection-updated';
import {
  cleanup,
  collectionEntry1,
  objectEntry1,
  relatedEntry1,
  relatedEntry2,
  setup,
  timestampEntry1,
} from '../test-utils';
import { virtualCollectionId } from '../utils';
import { updateDatabaseEntryProperty } from './updateDatabaseEntryProperty';

// Mock SQL operations since no database connection is available in tests
vi.mock('../sql', () => ({
  sqlUpsertEntries: vi.fn(),
}));

describe('updateDatabaseEntryProperty', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('updates the property value', async () => {
    await updateDatabaseEntryProperty(
      objectEntry1.id,
      'Content',
      'Updated content',
    );

    // The property value should be written to the entry
    const entry = DatabaseEntriesStore.get(objectEntry1.id);

    expect(entry?.properties.Content).toBe('Updated content');
  });

  it('throws when the property does not exist', async () => {
    await expect(
      updateDatabaseEntryProperty(objectEntry1.id, 'Missing', 'Value'),
    ).rejects.toThrow(InvalidParameterError);
  });

  describe('collection properties', () => {
    beforeEach(() => {
      // Create the virtual collection for the Related property
      Collections.createVirtual(
        virtualCollectionId(collectionEntry1.id, 'Related'),
        'Related',
        collectionEntry1.properties.Related as string[],
      );

      // Register the collection write-back handler
      Events.addListener(CollectionUpdatedEvent, 'test', ({ data }) =>
        onUpdateCollection(data),
      );
    });

    it('updates the value through the virtual collection', async () => {
      const updated = await updateDatabaseEntryProperty(
        collectionEntry1.id,
        'Related',
        [relatedEntry1.id],
      );

      // Both the virtual collection and the entry property
      // should reflect the change
      const collection = Collections.get(
        virtualCollectionId(collectionEntry1.id, 'Related'),
      );
      expect(collection.items).toEqual([relatedEntry1.id]);
      expect(updated.properties.Related).toEqual([relatedEntry1.id]);
    });

    it('updates the property directly when no virtual collection exists', async () => {
      // The References property has no virtual collection
      const updated = await updateDatabaseEntryProperty(
        collectionEntry1.id,
        'References',
        [relatedEntry2.id],
      );

      expect(updated.properties.References).toEqual([relatedEntry2.id]);
    });
  });

  describe('timestamp metadata properties', () => {
    it('ignores updates to implicit timestamp properties', async () => {
      // The object database declares no timestamp properties, so
      // Created and Last modified are implicit
      await updateDatabaseEntryProperty(
        objectEntry1.id,
        'Created',
        new Date('2030-01-01T00:00:00.000Z'),
      );
      await updateDatabaseEntryProperty(
        objectEntry1.id,
        'Last modified',
        new Date('2030-01-01T00:00:00.000Z'),
      );

      const entry = DatabaseEntriesStore.get(objectEntry1.id);

      // The metadata should be untouched and no property written
      expect(entry?.properties).toEqual(objectEntry1.properties);
      expect(entry?.created).toEqual(objectEntry1.created);
      expect(entry?.lastModified).toEqual(objectEntry1.lastModified);
    });

    it('ignores updates to declared timestamp properties', async () => {
      await updateDatabaseEntryProperty(
        timestampEntry1.id,
        'Created',
        new Date('2030-01-01T00:00:00.000Z'),
      );
      await updateDatabaseEntryProperty(
        timestampEntry1.id,
        'Last Modified',
        new Date('2030-01-01T00:00:00.000Z'),
      );

      const entry = DatabaseEntriesStore.get(timestampEntry1.id);

      expect(entry?.properties).toEqual(timestampEntry1.properties);
    });
  });

  it('renames the entry for title properties', async () => {
    await updateDatabaseEntryProperty(
      objectEntry1.id,
      'Title',
      'Renamed Entry',
    );

    // The renamed entry should be in the store under its unchanged ID
    const renamed = DatabaseEntriesStore.get(objectEntry1.id);

    expect(renamed?.title).toBe('Renamed Entry');
    // The entry properties should be untouched
    expect(renamed?.properties).toEqual(objectEntry1.properties);
  });

  it('renames the entry to an untitled title on empty title updates', async () => {
    await updateDatabaseEntryProperty(objectEntry1.id, 'Title', '');

    // The entry should be renamed to the localised untitled title
    const renamed = DatabaseEntriesStore.getAllArray().find(
      (entry) => entry.database === objectEntry1.database,
    );

    expect(renamed?.title).toBe('Untitled');
  });

  it('increments the untitled title on conflict', async () => {
    // Rename the entry to the untitled title
    await updateDatabaseEntryProperty(objectEntry1.id, 'Title', '');

    const untitledEntry = DatabaseEntriesStore.getAllArray().find(
      (entry) => entry.database === objectEntry1.database,
    );

    // Update with another empty title, conflicting with the
    // entry's own untitled file
    await updateDatabaseEntryProperty(untitledEntry!.id, 'Title', '');

    // The entry should be renamed to an incremented untitled title
    const renamed = DatabaseEntriesStore.getAllArray().find(
      (entry) => entry.database === objectEntry1.database,
    );

    expect(isUntitledTitle(renamed!.title)).toBe(true);
    expect(renamed!.title).not.toBe('Untitled');
  });
});
