import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Collections } from '@minddrop/collections';
import { DatabasesStore } from '../../DatabasesStore';
import {
  sqlGetAllEntriesFull,
  sqlGetEntrySyncRecords,
  sqlUpsertDatabase,
} from '../../sql';
import {
  MockFs,
  cleanup,
  cleanupTestSqlDatabase,
  collectionDatabase,
  collectionEntry1,
  entryTemplate1,
  entryTemplate2,
  entryTemplatesDatabase,
  objectDatabase,
  relatedEntry1,
  relatedEntry2,
  setup,
  setupTestSqlDatabase,
} from '../../test-utils';
import { Database } from '../../types';
import {
  entryTemplateFilePath,
  virtualCollectionId,
  virtualCollectionName,
} from '../../utils';
import { onRemoveProperty } from './property-removed';

/**
 * Returns a copy of a database with the named property removed
 * from its schema, matching the database shape carried by the
 * property removed event.
 */
function withoutProperty(database: Database, propertyName: string): Database {
  return {
    ...database,
    properties: database.properties.filter(
      (property) => property.name !== propertyName,
    ),
  };
}

describe('onRemoveProperty', () => {
  beforeEach(() => {
    setup();

    // Open an in-memory SQL database
    setupTestSqlDatabase();

    // Seed the database records the re-indexed entries belong to
    [collectionDatabase, objectDatabase, entryTemplatesDatabase].forEach(
      (database) => {
        sqlUpsertDatabase(
          {
            id: database.id,
            name: database.name,
            path: database.path,
            icon: database.icon,
          },
          { silent: true },
        );
      },
    );

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

  it("re-indexes the database's entries in SQL", async () => {
    // Find the Related property schema
    const property = collectionDatabase.properties.find(
      (p) => p.name === 'Related',
    )!;

    // The event carries the database with the property already removed
    const database = withoutProperty(collectionDatabase, 'Related');

    await onRemoveProperty({ database, property });

    // The database's entries should be re-upserted into SQL
    const recordIds = sqlGetEntrySyncRecords(collectionDatabase.id).map(
      (record) => record.id,
    );

    expect(recordIds).toContain(collectionEntry1.id);
    expect(recordIds).toContain(relatedEntry1.id);
    expect(recordIds).toContain(relatedEntry2.id);

    // The re-indexed records should no longer carry the removed property
    const record = sqlGetAllEntriesFull().find(
      (entryRecord) => entryRecord.id === collectionEntry1.id,
    )!;
    const propertyNames = record.properties.map(
      (entryProperty) => entryProperty.name,
    );

    expect(propertyNames).not.toContain('Related');
    expect(propertyNames).toContain('References');
  });

  it('does nothing if the property is not a collection type', async () => {
    // Remove a non-collection property
    await onRemoveProperty({
      database: withoutProperty(objectDatabase, 'Content'),
      property: { type: 'text', name: 'Content' },
    });

    // Virtual collections should be unchanged
    const related = Collections.Store.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );
    expect(related).not.toBeNull();
  });

  it('deletes virtual collections for all entries', async () => {
    // Find the Related property schema
    const property = collectionDatabase.properties.find(
      (p) => p.name === 'Related',
    )!;

    await onRemoveProperty({
      database: withoutProperty(collectionDatabase, 'Related'),
      property,
    });

    // The 'Related' virtual collection should be deleted
    const related = Collections.Store.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );
    expect(related).toBeNull();

    // The 'References' virtual collection should still exist
    const references = Collections.Store.get(
      virtualCollectionId(collectionEntry1.id, 'References'),
    );
    expect(references).not.toBeNull();
  });

  describe('entry templates', () => {
    it("clears the property from the database's entry templates", async () => {
      const property = entryTemplatesDatabase.properties.find(
        (p) => p.name === 'Notes',
      )!;

      await onRemoveProperty({
        database: withoutProperty(entryTemplatesDatabase, 'Notes'),
        property,
      });

      const templates = DatabasesStore.get(
        entryTemplatesDatabase.id,
      )!.entryTemplates!;

      // The removed property's value should be gone
      expect(templates[0].properties.Notes).toBeUndefined();
      // Other values should be untouched
      expect(templates[0].properties.Image).toBe(
        entryTemplate1.properties.Image,
      );
    });

    it('deletes files stored for a removed file based property', async () => {
      const property = entryTemplatesDatabase.properties.find(
        (p) => p.name === 'Image',
      )!;
      const storedImagePath = entryTemplateFilePath(
        entryTemplatesDatabase.path,
        entryTemplate1.id,
        'template-image.png',
      );

      await onRemoveProperty({
        database: withoutProperty(entryTemplatesDatabase, 'Image'),
        property,
      });

      // The stored file should be deleted
      expect(MockFs.exists(storedImagePath)).toBeFalsy();

      const templates = DatabasesStore.get(
        entryTemplatesDatabase.id,
      )!.entryTemplates!;

      // The removed property's value should be gone
      expect(templates[0].properties.Image).toBeUndefined();
    });

    it('leaves the config untouched when no template uses the property', async () => {
      const property = entryTemplatesDatabase.properties.find(
        (p) => p.name === 'Count',
      )!;

      await onRemoveProperty({
        database: withoutProperty(entryTemplatesDatabase, 'Count'),
        property,
      });

      const templates = DatabasesStore.get(
        entryTemplatesDatabase.id,
      )!.entryTemplates!;

      // The templates should be unchanged
      expect(templates).toEqual([entryTemplate1, entryTemplate2]);
    });
  });
});
