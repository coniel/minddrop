import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Collections } from '@minddrop/collections';
import { Properties } from '@minddrop/properties';
import { storeItem } from '@minddrop/stores/test-utils';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { DatabaseEntryTemplatesStore } from '../../DatabaseEntryTemplatesStore';
import { DatabasesStore } from '../../DatabasesStore';
import {
  sqlGetAllEntriesFull,
  sqlUpsertDatabase,
  sqlUpsertEntries,
} from '../../sql';
import {
  MockFs,
  cleanup,
  cleanupTestSqlDatabase,
  collectionDatabase,
  collectionEntry1,
  collectionEntry1SqlRecord,
  databaseDirPath,
  entryTemplate1,
  entryTemplatesDatabase,
  objectDatabase,
  objectEntry1,
  propertyStorageDatabase,
  setup,
  setupTestSqlDatabase,
} from '../../test-utils';
import { Database } from '../../types';
import { virtualCollectionId, virtualCollectionName } from '../../utils';
import { onRenameProperty } from './property-renamed';

/**
 * Renames a property in the stored database config and runs the
 * rename handler against it, as the rename API function does.
 */
async function renameProperty(
  database: Database,
  oldName: string,
  newName: string,
): Promise<void> {
  // Apply the rename to the database config
  const updated: Database = {
    ...database,
    properties: Properties.rename(database.properties, oldName, newName),
  };

  // Update the stored config
  DatabasesStore.update(database.id, updated);

  // Run the rename handler
  await onRenameProperty({ original: database, updated, oldName, newName });
}

describe('onRenameProperty', () => {
  beforeEach(() => {
    setup();

    // Open an in-memory SQL database
    setupTestSqlDatabase();

    // Seed the collection database record
    sqlUpsertDatabase(
      {
        id: collectionDatabase.id,
        name: collectionDatabase.name,
        path: collectionDatabase.path,
        icon: collectionDatabase.icon,
      },
      { silent: true },
    );

    // Seed the collection entry's record so the rename has
    // property rows to update.
    sqlUpsertEntries(collectionDatabase.id, [collectionEntry1SqlRecord], {
      silent: true,
    });

    // Create virtual collections for the collection entry
    Collections.createVirtual(
      virtualCollectionId(collectionEntry1.id, 'Related'),
      virtualCollectionName(
        collectionDatabase.name,
        collectionEntry1.title,
        'Related',
      ),
      collectionEntry1.properties.Related as string[],
    );
    Collections.createVirtual(
      virtualCollectionId(collectionEntry1.id, 'References'),
      virtualCollectionName(
        collectionDatabase.name,
        collectionEntry1.title,
        'References',
      ),
      collectionEntry1.properties.References as string[],
    );
  });

  afterEach(async () => {
    cleanupTestSqlDatabase();
    await cleanup();
  });

  it("renames the property across the entries' SQL records", async () => {
    // Rename the 'Related' collection property to 'Links'
    await renameProperty(collectionDatabase, 'Related', 'Links');

    // Find the entry's SQL record
    const record = sqlGetAllEntriesFull().find(
      (entryRecord) => entryRecord.id === collectionEntry1.id,
    )!;

    // The property rows should carry the new name with their values
    expect(record.properties).toContainEqual({
      name: 'Links',
      type: 'collection',
      value: collectionEntry1.properties.Related,
    });
    // No rows should remain under the old name
    expect(record.properties).not.toContainEqual(
      expect.objectContaining({ name: 'Related' }),
    );
  });

  it("re-keys the property in the database's entries", async () => {
    await renameProperty(objectDatabase, 'Icon', 'Symbol');

    // The entry should hold its value under the new name
    expect(
      storeItem(DatabaseEntriesStore, objectEntry1.id).properties.Symbol,
    ).toBe(objectEntry1.properties.Icon);
  });

  it("re-keys the property in the database's entry templates", async () => {
    await renameProperty(entryTemplatesDatabase, 'Notes', 'Details');

    // The template should hold its value under the new name
    expect(
      storeItem(DatabaseEntryTemplatesStore, entryTemplate1.id).properties
        .Details,
    ).toBe(entryTemplate1.properties.Notes);
  });

  it("renames the property's file directory", async () => {
    await renameProperty(propertyStorageDatabase, 'Image', 'Cover');

    // The property's files should have moved to the new directory
    expect(
      MockFs.exists(
        `${databaseDirPath(propertyStorageDatabase)}/Cover/image.png`,
      ),
    ).toBe(true);
  });

  it('does nothing if the renamed property is not a collection type', async () => {
    // Rename a non-collection property
    await renameProperty(objectDatabase, 'Content', 'Body');

    // Virtual collections should be unchanged
    const related = Collections.Store.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );
    expect(related).not.toBeNull();
  });

  it('replaces virtual collections with new ones under the new property name', async () => {
    // Rename the 'Related' collection property to 'Links'
    await renameProperty(collectionDatabase, 'Related', 'Links');

    // The old virtual collection should be deleted
    const oldCollection = Collections.Store.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );
    expect(oldCollection).toBeNull();

    // A new virtual collection should exist with the new name
    const newCollection = Collections.Store.get(
      virtualCollectionId(collectionEntry1.id, 'Links'),
    );
    expect(newCollection).not.toBeNull();
    expect(newCollection!.virtual).toBe(true);
    expect(newCollection!.name).toBe(
      virtualCollectionName(
        collectionDatabase.name,
        collectionEntry1.title,
        'Links',
      ),
    );

    // The new collection should have the same entries as the old one
    expect(newCollection!.items).toEqual(collectionEntry1.properties.Related);
  });

  it('does not affect other collection properties', async () => {
    // Rename the 'Related' collection property
    await renameProperty(collectionDatabase, 'Related', 'Links');

    // The 'References' virtual collection should be unchanged
    const references = Collections.Store.get(
      virtualCollectionId(collectionEntry1.id, 'References'),
    );
    expect(references).not.toBeNull();
    expect(references!.name).toBe(
      virtualCollectionName(
        collectionDatabase.name,
        collectionEntry1.title,
        'References',
      ),
    );
  });
});
