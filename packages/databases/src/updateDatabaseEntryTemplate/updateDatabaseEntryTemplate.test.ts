import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { DatabaseEntryTemplateNotFoundError } from '../errors';
import { DatabaseEntryTemplateUpdatedEvent } from '../events';
import { getDatabaseEntryTemplate } from '../getDatabaseEntryTemplate';
import {
  MockFs,
  cleanup,
  databaseDirPath,
  entryTemplate1,
  entryTemplatesDatabase,
  mockDate,
  parentDir,
  setup,
} from '../test-utils';
import {
  resolveEntryTemplateConfigFilePath,
  resolveEntryTemplateFilePath,
} from '../utils';
import { updateDatabaseEntryTemplate } from './updateDatabaseEntryTemplate';

const sourceImagePath = `${parentDir}/source-image.png`;
// Path to entryTemplate1's stored image file
const storedImagePath = resolveEntryTemplateFilePath(
  databaseDirPath(entryTemplatesDatabase),
  entryTemplate1.id,
  'template-image.png',
);

describe('updateDatabaseEntryTemplate', () => {
  beforeEach(() => {
    setup();

    // Add a source image file to copy into templates
    MockFs.addFiles([sourceImagePath]);
  });

  afterEach(cleanup);

  it('throws if the template does not exist', async () => {
    await expect(
      updateDatabaseEntryTemplate('missing', { name: 'Renamed' }),
    ).rejects.toThrow(DatabaseEntryTemplateNotFoundError);
  });

  it('merges the updated data into the template', async () => {
    await updateDatabaseEntryTemplate(entryTemplate1.id, {
      name: 'Renamed',
      defaultTitle: 'New Title',
    });

    const template = getDatabaseEntryTemplate(entryTemplate1.id);

    // Name and default title should be updated, properties untouched
    expect(template.name).toBe('Renamed');
    expect(template.defaultTitle).toBe('New Title');
    expect(template.properties).toEqual(entryTemplate1.properties);
  });

  it('rejects changing a file based property value without a file', async () => {
    await expect(
      updateDatabaseEntryTemplate(entryTemplate1.id, {
        properties: { ...entryTemplate1.properties, Image: 'other.png' },
      }),
    ).rejects.toThrow(InvalidParameterError);

    // The template's stored file should be untouched
    expect(MockFs.exists(storedImagePath)).toBeTruthy();
  });

  it('replaces the property values wholesale', async () => {
    await updateDatabaseEntryTemplate(entryTemplate1.id, {
      properties: { Notes: 'Other notes', Image: 'template-image.png' },
    });

    const template = getDatabaseEntryTemplate(entryTemplate1.id);

    expect(template.properties).toEqual({
      Notes: 'Other notes',
      Image: 'template-image.png',
    });
  });

  it('writes the updated template config file', async () => {
    await updateDatabaseEntryTemplate(entryTemplate1.id, { name: 'Renamed' });

    // The config file should contain the updated template without
    // the database ID.
    expect(
      MockFs.readJsonFile(
        resolveEntryTemplateConfigFilePath(
          databaseDirPath(entryTemplatesDatabase),
          entryTemplate1.id,
        ),
      ),
    ).toEqual({
      id: entryTemplate1.id,
      name: 'Renamed',
      defaultTitle: entryTemplate1.defaultTitle,
      properties: entryTemplate1.properties,
      created: entryTemplate1.created,
      lastModified: mockDate,
    });
  });

  it('bumps lastModified, leaving created untouched', async () => {
    await updateDatabaseEntryTemplate(entryTemplate1.id, { name: 'Renamed' });

    const template = getDatabaseEntryTemplate(entryTemplate1.id);

    expect(template.lastModified).toEqual(mockDate);
    expect(template.created).toEqual(entryTemplate1.created);
  });

  it('deletes the stored file when a file property value is cleared', async () => {
    await updateDatabaseEntryTemplate(entryTemplate1.id, {
      properties: { Notes: 'Prefilled notes' },
    });

    // The stored image file should be deleted
    expect(MockFs.exists(storedImagePath)).toBeFalsy();
  });

  it('deletes and replaces the stored file when a new file is provided', async () => {
    await updateDatabaseEntryTemplate(
      entryTemplate1.id,
      { properties: entryTemplate1.properties },
      { Image: sourceImagePath },
    );

    const template = getDatabaseEntryTemplate(entryTemplate1.id);

    // The old stored file should be deleted
    expect(MockFs.exists(storedImagePath)).toBeFalsy();
    // The new file should exist in the template's directory
    expect(
      MockFs.exists(
        resolveEntryTemplateFilePath(
          databaseDirPath(entryTemplatesDatabase),
          entryTemplate1.id,
          'source-image.png',
        ),
      ),
    ).toBeTruthy();
    // The new file name should be stored as the property value
    expect(template.properties.Image).toBe('source-image.png');
  });

  it('dispatches an entry template updated event', async () =>
    new Promise<void>((done) => {
      Events.addListener(
        DatabaseEntryTemplateUpdatedEvent,
        'test',
        (payload) => {
          // Payload data should be the updated template
          expect(payload.id).toBe(entryTemplate1.id);
          expect(payload.name).toBe('Renamed');
          done();
        },
      );

      updateDatabaseEntryTemplate(entryTemplate1.id, { name: 'Renamed' });
    }));
});
