import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PropertySchema } from '@minddrop/properties';
import { storeItem } from '@minddrop/stores/test-utils';
import { DatabaseEntryTemplatesStore } from '../DatabaseEntryTemplatesStore';
import { DatabasesStore } from '../DatabasesStore';
import {
  DatabaseFixtures,
  MockFs,
  cleanup,
  setup,
  withoutDatabaseProperty,
} from '../test-utils';
import { resolveEntryTemplateFilePath } from '../utils';
import { clearDatabaseEntryTemplatesProperty } from './clearDatabaseEntryTemplatesProperty';

const {
  countPropertyName,
  databaseDirPath,
  entryTemplate1,
  entryTemplate2,
  entryTemplatesDatabase,
  imagePropertyName,
  notesPropertyName,
} = DatabaseFixtures;

describe('clearDatabaseEntryTemplatesProperty', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('drops the value from the templates that have one', async () => {
    // Clear a property without a stored file
    await clearDatabaseEntryTemplatesProperty(
      entryTemplatesDatabase.id,
      removeProperty(notesPropertyName),
    );

    // Get the template from the store
    const template = storeItem(DatabaseEntryTemplatesStore, entryTemplate1.id);

    // The property's value should be gone
    expect(template.properties).not.toHaveProperty(notesPropertyName);
    // Other values should be untouched
    expect(template.properties[imagePropertyName]).toBe(
      entryTemplate1.properties[imagePropertyName],
    );
  });

  it('deletes the files stored for a file based property', async () => {
    // Resolve the path of the template's stored image file
    const storedImagePath = resolveEntryTemplateFilePath(
      databaseDirPath(entryTemplatesDatabase),
      entryTemplate1.id,
      entryTemplate1.properties[imagePropertyName] as string,
    );

    // Clear the file based property
    await clearDatabaseEntryTemplatesProperty(
      entryTemplatesDatabase.id,
      removeProperty(imagePropertyName),
    );

    // The stored file should be deleted
    expect(MockFs.exists(storedImagePath)).toBe(false);
    // The property's value should be gone
    expect(
      storeItem(DatabaseEntryTemplatesStore, entryTemplate1.id).properties,
    ).not.toHaveProperty(imagePropertyName);
  });

  it('leaves the templates untouched when none have a value for it', async () => {
    // Clear a property no template has a value for
    await clearDatabaseEntryTemplatesProperty(
      entryTemplatesDatabase.id,
      removeProperty(countPropertyName),
    );

    // The templates should be untouched
    expect(storeItem(DatabaseEntryTemplatesStore, entryTemplate1.id)).toEqual(
      entryTemplate1,
    );
    expect(storeItem(DatabaseEntryTemplatesStore, entryTemplate2.id)).toEqual(
      entryTemplate2,
    );
  });
});

/**
 * Removes a property from the entry templates database's schema.
 *
 * @param name - The name of the property to remove.
 * @returns The property as the schema declared it before its removal.
 */
function removeProperty(name: string): PropertySchema {
  // Get the property's schema
  const property = entryTemplatesDatabase.properties.find(
    (candidate) => candidate.name === name,
  )!;

  // Remove the property from the database's schema
  DatabasesStore.update(
    entryTemplatesDatabase.id,
    withoutDatabaseProperty(entryTemplatesDatabase, name),
  );

  return property;
}
