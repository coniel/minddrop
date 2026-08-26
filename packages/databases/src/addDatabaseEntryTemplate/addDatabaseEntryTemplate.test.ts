import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseEntryTemplateAddedEvent } from '../events';
import {
  MockFs,
  cleanup,
  entryTemplatesDatabase,
  parentDir,
  setup,
} from '../test-utils';
import { entryTemplateFilePath } from '../utils';
import { addDatabaseEntryTemplate } from './addDatabaseEntryTemplate';

const sourceImagePath = `${parentDir}/source-image.png`;

describe('addDatabaseEntryTemplate', () => {
  beforeEach(() => {
    setup();

    // Add a source image file to copy into templates
    MockFs.addFiles([sourceImagePath]);
  });

  afterEach(cleanup);

  it('adds the template to the database config with a generated ID', async () => {
    await addDatabaseEntryTemplate(entryTemplatesDatabase.id, {
      name: 'New Template',
      defaultTitle: 'New Entry',
      properties: { Notes: 'Some notes' },
    });

    const template = DatabasesStore.get(
      entryTemplatesDatabase.id,
    )!.entryTemplates!.at(-1)!;

    expect(template).toEqual({
      id: expect.stringMatching(/^database-entry-template_/),
      name: 'New Template',
      defaultTitle: 'New Entry',
      properties: { Notes: 'Some notes' },
    });
  });

  it('prunes empty property values', async () => {
    await addDatabaseEntryTemplate(entryTemplatesDatabase.id, {
      name: 'New Template',
      properties: {
        Notes: '',
        Status: [],
        Due: null,
        Urgent: false,
        Count: 0,
      },
    });

    const template = DatabasesStore.get(
      entryTemplatesDatabase.id,
    )!.entryTemplates!.at(-1)!;

    // Empty values should be dropped, false and 0 kept
    expect(template.properties).toEqual({ Urgent: false, Count: 0 });
  });

  it('copies provided files into the template directory', async () => {
    await addDatabaseEntryTemplate(
      entryTemplatesDatabase.id,
      { name: 'New Template', properties: {} },
      { Image: sourceImagePath },
    );

    const template = DatabasesStore.get(
      entryTemplatesDatabase.id,
    )!.entryTemplates!.at(-1)!;

    // The file name should be stored as the property value
    expect(template.properties.Image).toBe('source-image.png');
    // The file should exist in the template's directory
    expect(
      MockFs.exists(
        entryTemplateFilePath(
          entryTemplatesDatabase.path,
          template.id,
          'source-image.png',
        ),
      ),
    ).toBeTruthy();
  });

  it('dispatches an entry template added event', async () =>
    new Promise<void>((done) => {
      Events.addListener(DatabaseEntryTemplateAddedEvent, 'test', (payload) => {
        // Payload data should contain the updated database and new template
        expect(payload.data.database.id).toBe(entryTemplatesDatabase.id);
        expect(payload.data.template.name).toBe('New Template');
        done();
      });

      addDatabaseEntryTemplate(entryTemplatesDatabase.id, {
        name: 'New Template',
        properties: {},
      });
    }));
});
