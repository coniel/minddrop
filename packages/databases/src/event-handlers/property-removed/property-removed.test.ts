import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Collections } from '@minddrop/collections';
import { DatabasesStore } from '../../DatabasesStore';
import {
  MockFs,
  cleanup,
  collectionDatabase,
  collectionEntry1,
  entryTemplate1,
  entryTemplate2,
  entryTemplatesDatabase,
  objectDatabase,
  setup,
} from '../../test-utils';
import {
  entryTemplateFilePath,
  virtualCollectionId,
  virtualCollectionName,
} from '../../utils';
import { onRemoveProperty } from './property-removed';

vi.mock('../../sql', () => ({
  sqlReindexDatabaseEntries: vi.fn(),
}));

describe('onRemoveProperty', () => {
  beforeEach(() => {
    setup();

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

  afterEach(cleanup);

  it('does nothing if the property is not a collection type', async () => {
    // Remove a non-collection property
    await onRemoveProperty({
      database: objectDatabase,
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

    await onRemoveProperty({ database: collectionDatabase, property });

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

      await onRemoveProperty({ database: entryTemplatesDatabase, property });

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

      await onRemoveProperty({ database: entryTemplatesDatabase, property });

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

      await onRemoveProperty({ database: entryTemplatesDatabase, property });

      const templates = DatabasesStore.get(
        entryTemplatesDatabase.id,
      )!.entryTemplates!;

      // The templates should be unchanged
      expect(templates).toEqual([entryTemplate1, entryTemplate2]);
    });
  });
});
