import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseEntryTemplateNotFoundError } from '../errors';
import { DatabaseEntryTemplateUpdatedEvent } from '../events';
import {
  MockFs,
  cleanup,
  entryTemplate1,
  entryTemplatesDatabase,
  parentDir,
  setup,
} from '../test-utils';
import { entryTemplateFilePath } from '../utils';
import { updateDatabaseEntryTemplate } from './updateDatabaseEntryTemplate';

const sourceImagePath = `${parentDir}/source-image.png`;
// Path to entryTemplate1's stored image file
const storedImagePath = entryTemplateFilePath(
  entryTemplatesDatabase.path,
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
      updateDatabaseEntryTemplate(entryTemplatesDatabase.id, 'missing', {
        name: 'Renamed',
      }),
    ).rejects.toThrow(DatabaseEntryTemplateNotFoundError);
  });

  it('merges the updated data into the template', async () => {
    await updateDatabaseEntryTemplate(
      entryTemplatesDatabase.id,
      entryTemplate1.id,
      { name: 'Renamed', defaultTitle: 'New Title' },
    );

    const template = DatabasesStore.get(entryTemplatesDatabase.id)!
      .entryTemplates![0];

    // Name and default title should be updated, properties untouched
    expect(template.name).toBe('Renamed');
    expect(template.defaultTitle).toBe('New Title');
    expect(template.properties).toEqual(entryTemplate1.properties);
  });

  it('replaces the property values wholesale', async () => {
    await updateDatabaseEntryTemplate(
      entryTemplatesDatabase.id,
      entryTemplate1.id,
      { properties: { Notes: 'Other notes', Image: 'template-image.png' } },
    );

    const template = DatabasesStore.get(entryTemplatesDatabase.id)!
      .entryTemplates![0];

    expect(template.properties).toEqual({
      Notes: 'Other notes',
      Image: 'template-image.png',
    });
  });

  it('deletes the stored file when a file property value is cleared', async () => {
    await updateDatabaseEntryTemplate(
      entryTemplatesDatabase.id,
      entryTemplate1.id,
      { properties: { Notes: 'Prefilled notes' } },
    );

    // The stored image file should be deleted
    expect(MockFs.exists(storedImagePath)).toBeFalsy();
  });

  it('deletes and replaces the stored file when a new file is provided', async () => {
    await updateDatabaseEntryTemplate(
      entryTemplatesDatabase.id,
      entryTemplate1.id,
      { properties: entryTemplate1.properties },
      { Image: sourceImagePath },
    );

    const template = DatabasesStore.get(entryTemplatesDatabase.id)!
      .entryTemplates![0];

    // The old stored file should be deleted
    expect(MockFs.exists(storedImagePath)).toBeFalsy();
    // The new file should exist in the template's directory
    expect(
      MockFs.exists(
        entryTemplateFilePath(
          entryTemplatesDatabase.path,
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
          // Payload data should contain the updated database and template
          expect(payload.data.database.id).toBe(entryTemplatesDatabase.id);
          expect(payload.data.template.name).toBe('Renamed');
          done();
        },
      );

      updateDatabaseEntryTemplate(
        entryTemplatesDatabase.id,
        entryTemplate1.id,
        {
          name: 'Renamed',
        },
      );
    }));
});
