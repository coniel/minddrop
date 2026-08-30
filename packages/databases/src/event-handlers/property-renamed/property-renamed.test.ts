import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Collections } from '@minddrop/collections';
import { getDatabase } from '../../getDatabase';
import {
  sqlGetAllEntriesFull,
  sqlUpsertDatabase,
  sqlUpsertEntries,
} from '../../sql';
import {
  cleanup,
  cleanupTestSqlDatabase,
  collectionDatabase,
  collectionEntry1,
  collectionEntry1SqlRecord,
  objectDatabase,
  setup,
  setupTestSqlDatabase,
} from '../../test-utils';
import { virtualCollectionId, virtualCollectionName } from '../../utils';
import { onRenameProperty } from './property-renamed';

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
    // property rows to update
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

  afterEach(() => {
    cleanupTestSqlDatabase();
    cleanup();
  });

  it("renames the property across the entries' SQL records", async () => {
    // Rename the 'Related' collection property to 'Links'
    const renamedDatabase = {
      ...collectionDatabase,
      properties: collectionDatabase.properties.map((property) =>
        property.name === 'Related' ? { ...property, name: 'Links' } : property,
      ),
    };

    await onRenameProperty({
      database: renamedDatabase,
      oldName: 'Related',
      newName: 'Links',
    });

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

  it('remaps design property map values pointing at the renamed property', async () => {
    // Rename 'Content' to 'Body' with a design property map that
    // maps a design property onto it
    await onRenameProperty({
      database: {
        ...objectDatabase,
        designPropertyMap: { Heading: 'Content', Cover: 'Icon' },
      },
      oldName: 'Content',
      newName: 'Body',
    });

    // The map value pointing at 'Content' should now point at 'Body',
    // other entries left untouched
    expect(getDatabase(objectDatabase.id).designPropertyMap).toEqual({
      Heading: 'Body',
      Cover: 'Icon',
    });
  });

  it('follows the rename when the property colors the entries', async () => {
    await onRenameProperty({
      database: {
        ...objectDatabase,
        colorProperty: 'Content',
      },
      oldName: 'Content',
      newName: 'Body',
    });

    // The color property setting should follow the rename
    expect(getDatabase(objectDatabase.id).colorProperty).toBe('Body');
  });

  it('does not update the database when no map value matches', async () => {
    await onRenameProperty({
      database: {
        ...objectDatabase,
        designPropertyMap: { Heading: 'Content' },
      },
      oldName: 'Icon',
      newName: 'Symbol',
    });

    // The design property map should be unchanged
    expect(getDatabase(objectDatabase.id).designPropertyMap).toEqual({});
  });

  it('does nothing if the renamed property is not a collection type', async () => {
    // Rename a non-collection property
    await onRenameProperty({
      database: objectDatabase,
      oldName: 'Content',
      newName: 'Body',
    });

    // Virtual collections should be unchanged
    const related = Collections.Store.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );
    expect(related).not.toBeNull();
  });

  it('replaces virtual collections with new ones under the new property name', async () => {
    // Rename the 'Related' collection property to 'Links'
    const renamedDatabase = {
      ...collectionDatabase,
      properties: collectionDatabase.properties.map((property) =>
        property.name === 'Related' ? { ...property, name: 'Links' } : property,
      ),
    };

    await onRenameProperty({
      database: renamedDatabase,
      oldName: 'Related',
      newName: 'Links',
    });

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
    const renamedDatabase = {
      ...collectionDatabase,
      properties: collectionDatabase.properties.map((property) =>
        property.name === 'Related' ? { ...property, name: 'Links' } : property,
      ),
    };

    await onRenameProperty({
      database: renamedDatabase,
      oldName: 'Related',
      newName: 'Links',
    });

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
