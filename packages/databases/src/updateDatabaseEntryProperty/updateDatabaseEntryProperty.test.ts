import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InvalidParameterError, isUntitledTitle } from '@minddrop/utils';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { cleanup, objectEntry1, setup } from '../test-utils';
import { updateDatabaseEntryProperty } from './updateDatabaseEntryProperty';

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

  it('renames the entry for title properties', async () => {
    await updateDatabaseEntryProperty(
      objectEntry1.id,
      'Title',
      'Renamed Entry',
    );

    // The renamed entry should be in the store under its new ID
    const renamed = DatabaseEntriesStore.getAllArray().find(
      (entry) => entry.title === 'Renamed Entry',
    );

    expect(renamed).toBeDefined();
    expect(renamed?.id).not.toBe(objectEntry1.id);
    // The entry properties should be untouched
    expect(renamed?.properties).toEqual(objectEntry1.properties);
    // The old ID should be removed from the store
    expect(DatabaseEntriesStore.get(objectEntry1.id)).toBeNull();
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
