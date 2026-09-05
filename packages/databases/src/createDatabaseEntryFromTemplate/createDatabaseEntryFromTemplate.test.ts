import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { i18n } from '@minddrop/i18n';
import { DatabasesStore } from '../DatabasesStore';
import {
  DatabaseEntryTemplateNotFoundError,
  DatabaseNotFoundError,
} from '../errors';
import {
  MockFs,
  cleanup,
  entryTemplate1,
  entryTemplate2,
  entryTemplatesDatabase,
  setup,
} from '../test-utils';
import { createDatabaseEntryFromTemplate } from './createDatabaseEntryFromTemplate';

describe('createDatabaseEntryFromTemplate', () => {
  beforeEach(() => {
    setup({ loadDatabaseEntries: false });
  });

  afterEach(cleanup);

  it('throws if the database does not exist', async () => {
    await expect(
      createDatabaseEntryFromTemplate('missing', entryTemplate1.id),
    ).rejects.toThrow(DatabaseNotFoundError);
  });

  it('throws if the template does not exist', async () => {
    await expect(
      createDatabaseEntryFromTemplate(entryTemplatesDatabase.id, 'missing'),
    ).rejects.toThrow(DatabaseEntryTemplateNotFoundError);
  });

  it("uses the template's default title as the entry title", async () => {
    const entry = await createDatabaseEntryFromTemplate(
      entryTemplatesDatabase.id,
      entryTemplate1.id,
    );

    expect(entry.title).toBe('Templated entry');
  });

  it('falls back to the untitled title when the template has no default title', async () => {
    const entry = await createDatabaseEntryFromTemplate(
      entryTemplatesDatabase.id,
      entryTemplate2.id,
    );

    expect(entry.title).toBe(i18n.t('labels.untitled'));
  });

  it("copies the template's simple property values onto the entry", async () => {
    const entry = await createDatabaseEntryFromTemplate(
      entryTemplatesDatabase.id,
      entryTemplate1.id,
    );

    expect(entry.properties.Notes).toBe('Prefilled notes');
  });

  it('copies file based property files to the entry file location', async () => {
    const entry = await createDatabaseEntryFromTemplate(
      entryTemplatesDatabase.id,
      entryTemplate1.id,
    );

    // The entry's property value should be the copied file's name
    expect(entry.properties.Image).toBe('template-image.png');
    // The file should be copied to the property file location dictated
    // by the database's property based storage mode.
    expect(
      MockFs.exists(`${entryTemplatesDatabase.path}/Image/template-image.png`),
    ).toBeTruthy();
  });

  it('increments the copied file name on repeat creations', async () => {
    await createDatabaseEntryFromTemplate(
      entryTemplatesDatabase.id,
      entryTemplate1.id,
    );
    const secondEntry = await createDatabaseEntryFromTemplate(
      entryTemplatesDatabase.id,
      entryTemplate1.id,
    );

    // The second copy should have an incremented file name
    expect(secondEntry.properties.Image).toBe('template-image 1.png');
    expect(
      MockFs.exists(
        `${entryTemplatesDatabase.path}/Image/template-image 1.png`,
      ),
    ).toBeTruthy();
  });

  it('skips file based properties whose source file is missing', async () => {
    // Remove the template's stored image file
    MockFs.removeFile(
      `${entryTemplatesDatabase.path}/.minddrop/templates/${entryTemplate1.id}/template-image.png`,
    );

    const entry = await createDatabaseEntryFromTemplate(
      entryTemplatesDatabase.id,
      entryTemplate1.id,
    );

    // The entry should be created without the image property value
    expect(entry.properties.Image).toBeUndefined();
  });

  it('ignores template values whose property no longer exists', async () => {
    // Remove the Notes property from the database schema
    DatabasesStore.update(entryTemplatesDatabase.id, {
      properties: entryTemplatesDatabase.properties.filter(
        (property) => property.name !== 'Notes',
      ),
    });

    const entry = await createDatabaseEntryFromTemplate(
      entryTemplatesDatabase.id,
      entryTemplate1.id,
    );

    // The removed property's value should not be set on the entry
    expect(entry.properties.Notes).toBeUndefined();
  });
  it('creates the entry with the given property values', async () => {
    const entry = await createDatabaseEntryFromTemplate(
      entryTemplatesDatabase.id,
      entryTemplate1.id,
      { Status: 'Todo' },
    );

    expect(entry.properties.Status).toBe('Todo');
  });

  it("overrides the template's values with the given ones", async () => {
    const entry = await createDatabaseEntryFromTemplate(
      entryTemplatesDatabase.id,
      entryTemplate1.id,
      { Notes: 'Overridden notes' },
    );

    expect(entry.properties.Notes).toBe('Overridden notes');
  });

  it("overrides the template's file values without copying the file", async () => {
    const entry = await createDatabaseEntryFromTemplate(
      entryTemplatesDatabase.id,
      entryTemplate1.id,
      { Image: 'custom.png' },
    );

    // The given value should win over the template's file copy
    expect(entry.properties.Image).toBe('custom.png');
    expect(
      MockFs.exists(`${entryTemplatesDatabase.path}/Image/template-image.png`),
    ).toBeFalsy();
  });
});
