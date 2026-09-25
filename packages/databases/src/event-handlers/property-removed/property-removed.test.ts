import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Collections } from '@minddrop/collections';
import { Design, Designs } from '@minddrop/designs-next';
import {
  DesignElementFixtures,
  DesignFixtures,
} from '@minddrop/designs-next/test-utils';
import { History } from '@minddrop/history';
import { storeItem } from '@minddrop/stores/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { EntryHistoryCauses, EntryHistorySubjectType } from '../../constants';
import { getDatabaseEntryTemplate } from '../../getDatabaseEntryTemplate';
import { getDatabaseEntryTemplates } from '../../getDatabaseEntryTemplates';
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
  databaseDirPath,
  entryTemplate1,
  entryTemplate2,
  entryTemplatesDatabase,
  objectDatabase,
  objectEntry1,
  propertyStorageDatabase,
  propertyStorageEntry1,
  relatedEntry1,
  relatedEntry2,
  setup,
  setupTestSqlDatabase,
} from '../../test-utils';
import { Database } from '../../types';
import {
  resolveEntryTemplateFilePath,
  virtualCollectionId,
  virtualCollectionName,
} from '../../utils';
import { onRemoveProperty } from './property-removed';

const { ownedCardDesign_1 } = DesignFixtures;
const { titleDesignElement } = DesignElementFixtures;

const { workspace_1 } = WorkspaceFixtures;

// The action performing the removal
const action = History.createAction(EntryHistoryCauses.PropertyRemoved);

// A design of the object database with an element mapping its
// 'Content' property.
const mappedDesign: Design = {
  ...ownedCardDesign_1,
  owner: objectDatabase.id,
  elements: [{ ...titleDesignElement, property: 'Content' }],
};

/**
 * Returns a copy of a database with the named property removed
 * from its schema, matching the updated config carried by the
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
    [
      collectionDatabase,
      objectDatabase,
      entryTemplatesDatabase,
      propertyStorageDatabase,
    ].forEach((database) => {
      sqlUpsertDatabase(
        {
          id: database.id,
          name: database.name,
          path: database.path,
          icon: database.icon,
        },
        { silent: true },
      );
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

    // Load the object database's design
    Designs.load([mappedDesign], workspace_1.id);
  });

  afterEach(async () => {
    cleanupTestSqlDatabase();
    await cleanup();
  });

  it("re-indexes the database's entries in SQL", async () => {
    // Find the Related property schema
    const property = collectionDatabase.properties.find(
      (p) => p.name === 'Related',
    )!;

    await onRemoveProperty({
      original: collectionDatabase,
      updated: withoutProperty(collectionDatabase, 'Related'),
      property,
      action,
    });

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
      original: objectDatabase,
      updated: withoutProperty(objectDatabase, 'Content'),
      property: { type: 'text', name: 'Content' },
      action,
    });

    // Virtual collections should be unchanged
    const related = Collections.Store.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );
    expect(related).not.toBeNull();
  });

  it("clears the property from the database's designs", async () => {
    await onRemoveProperty({
      original: objectDatabase,
      updated: withoutProperty(objectDatabase, 'Content'),
      property: { type: 'text', name: 'Content' },
      action,
    });

    // The design's element should no longer map the property
    expect(Designs.get(mappedDesign.id).elements[0].property).toBeUndefined();
  });

  it('deletes virtual collections for all entries', async () => {
    // Find the Related property schema
    const property = collectionDatabase.properties.find(
      (p) => p.name === 'Related',
    )!;

    await onRemoveProperty({
      original: collectionDatabase,
      updated: withoutProperty(collectionDatabase, 'Related'),
      property,
      action,
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

  describe('entries', () => {
    // The object database's icon property, as declared before its
    // removal.
    const iconProperty = objectDatabase.properties[1];

    /**
     * Runs the handler for the removal of the object database's
     * icon property.
     */
    function removeIconProperty(): Promise<void> {
      return onRemoveProperty({
        original: objectDatabase,
        updated: withoutProperty(objectDatabase, 'Icon'),
        property: iconProperty,
        action,
      });
    }

    it("clears the property's value from the database's entries", async () => {
      await removeIconProperty();

      // The value should be gone from the store
      expect(
        storeItem(DatabaseEntriesStore, objectEntry1.id).properties,
      ).not.toHaveProperty('Icon');
      // And from the entry's file
      expect(
        MockFs.readTextFile(
          `${databaseDirPath(objectDatabase)}/${objectEntry1.path}`,
        ),
      ).not.toContain('Icon:');
    });

    it('records the value dropped from each entry', async () => {
      await removeIconProperty();

      expect(
        await History.read({
          ownerPath: databaseDirPath(objectDatabase),
          subjectType: EntryHistorySubjectType,
          subjectKey: objectEntry1.title,
        }),
      ).toContainEqual(
        expect.objectContaining({
          kind: 'property',
          changes: [
            { property: 'Icon', from: objectEntry1.properties.Icon, to: null },
          ],
          action,
        }),
      );
    });

    it('records nothing against entries without a value for it', async () => {
      // An entry in the same database with no value for the property
      const withoutIcon = {
        ...objectEntry1,
        id: 'database-entry_without-icon' as const,
        title: 'Without Icon',
        path: 'Without Icon.md',
        properties: { Content: objectEntry1.properties.Content },
      };

      DatabaseEntriesStore.set(withoutIcon);

      await removeIconProperty();

      expect(
        await History.read({
          ownerPath: databaseDirPath(objectDatabase),
          subjectType: EntryHistorySubjectType,
          subjectKey: withoutIcon.title,
        }),
      ).toEqual([]);
    });

    it('leaves the files stored for a file based property in place', async () => {
      const property = propertyStorageDatabase.properties.find(
        (candidate) => candidate.name === 'Image',
      )!;
      const storedImagePath = `${databaseDirPath(propertyStorageDatabase)}/Image/${propertyStorageEntry1.properties.Image}`;

      await onRemoveProperty({
        original: propertyStorageDatabase,
        updated: withoutProperty(propertyStorageDatabase, 'Image'),
        property,
        action,
      });

      // The value should be gone from the entry
      expect(
        storeItem(DatabaseEntriesStore, propertyStorageEntry1.id).properties,
      ).not.toHaveProperty('Image');
      // The stored file should still be there
      expect(MockFs.exists(storedImagePath)).toBe(true);
    });
  });

  describe('entry templates', () => {
    it("clears the property from the database's entry templates", async () => {
      const property = entryTemplatesDatabase.properties.find(
        (p) => p.name === 'Notes',
      )!;

      await onRemoveProperty({
        original: entryTemplatesDatabase,
        updated: withoutProperty(entryTemplatesDatabase, 'Notes'),
        property,
        action,
      });

      const template = getDatabaseEntryTemplate(entryTemplate1.id);

      // The removed property's value should be gone
      expect(template.properties.Notes).toBeUndefined();
      // Other values should be untouched
      expect(template.properties.Image).toBe(entryTemplate1.properties.Image);
    });

    it('deletes files stored for a removed file based property', async () => {
      const property = entryTemplatesDatabase.properties.find(
        (p) => p.name === 'Image',
      )!;
      const storedImagePath = resolveEntryTemplateFilePath(
        databaseDirPath(entryTemplatesDatabase),
        entryTemplate1.id,
        'template-image.png',
      );

      await onRemoveProperty({
        original: entryTemplatesDatabase,
        updated: withoutProperty(entryTemplatesDatabase, 'Image'),
        property,
        action,
      });

      // The stored file should be deleted
      expect(MockFs.exists(storedImagePath)).toBeFalsy();

      // The removed property's value should be gone
      expect(
        getDatabaseEntryTemplate(entryTemplate1.id).properties.Image,
      ).toBeUndefined();
    });

    it('leaves the templates untouched when none use the property', async () => {
      const property = entryTemplatesDatabase.properties.find(
        (p) => p.name === 'Count',
      )!;

      await onRemoveProperty({
        original: entryTemplatesDatabase,
        updated: withoutProperty(entryTemplatesDatabase, 'Count'),
        property,
        action,
      });

      // The templates should be unchanged
      expect(getDatabaseEntryTemplates(entryTemplatesDatabase.id)).toEqual([
        entryTemplate1,
        entryTemplate2,
      ]);
    });
  });
});
