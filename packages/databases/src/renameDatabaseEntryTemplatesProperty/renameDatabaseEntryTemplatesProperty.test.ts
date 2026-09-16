import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { storeItem } from '@minddrop/stores/test-utils';
import { DatabaseEntryTemplatesStore } from '../DatabaseEntryTemplatesStore';
import {
  MockFs,
  cleanup,
  databaseDirPath,
  entryTemplate1,
  entryTemplate2,
  entryTemplatesDatabase,
  imagePropertyName,
  setup,
} from '../test-utils';
import { resolveEntryTemplateConfigFilePath } from '../utils';
import { renameDatabaseEntryTemplatesProperty } from './renameDatabaseEntryTemplatesProperty';

describe('renameDatabaseEntryTemplatesProperty', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('re-keys the value in the templates that have one', async () => {
    await renameDatabaseEntryTemplatesProperty(
      entryTemplatesDatabase.id,
      'Notes',
      'Details',
    );

    // Get the template from the store
    const template = storeItem(DatabaseEntryTemplatesStore, entryTemplate1.id);

    // The value should be under the new name
    expect(template.properties.Details).toBe(entryTemplate1.properties.Notes);
    expect(template.properties).not.toHaveProperty('Notes');
  });

  it('re-keys file based values, which carry a stored file name', async () => {
    await renameDatabaseEntryTemplatesProperty(
      entryTemplatesDatabase.id,
      imagePropertyName,
      'Cover',
    );

    // Get the template from the store
    const template = storeItem(DatabaseEntryTemplatesStore, entryTemplate1.id);

    // The stored file name should be under the new name
    expect(template.properties.Cover).toBe(
      entryTemplate1.properties[imagePropertyName],
    );
  });

  it('rewrites the template config files under the new name', async () => {
    await renameDatabaseEntryTemplatesProperty(
      entryTemplatesDatabase.id,
      'Notes',
      'Details',
    );

    // Read the template's config file
    const config = JSON.parse(
      MockFs.readTextFile(
        resolveEntryTemplateConfigFilePath(
          databaseDirPath(entryTemplatesDatabase),
          entryTemplate1.id,
        ),
      ),
    );

    expect(config.properties.Details).toBe(entryTemplate1.properties.Notes);
  });

  it('leaves templates without a value for the property alone', async () => {
    await renameDatabaseEntryTemplatesProperty(
      entryTemplatesDatabase.id,
      'Notes',
      'Details',
    );

    // No value should have been invented under the new name
    expect(
      storeItem(DatabaseEntryTemplatesStore, entryTemplate2.id).properties,
    ).toEqual({});
  });
});
