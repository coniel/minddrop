import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { DatabaseEntryTemplateCreatedEvent } from '../events';
import { getDatabase } from '../getDatabase';
import { getDatabaseEntryTemplate } from '../getDatabaseEntryTemplate';
import {
  MockFs,
  cleanup,
  databaseDirPath,
  entryTemplatesDatabase,
  mockDate,
  parentDir,
  setup,
} from '../test-utils';
import {
  resolveEntryTemplateConfigFilePath,
  resolveEntryTemplateFilePath,
} from '../utils';
import { createDatabaseEntryTemplate } from './createDatabaseEntryTemplate';

const sourceImagePath = `${parentDir}/source-image.png`;

describe('createDatabaseEntryTemplate', () => {
  beforeEach(() => {
    setup();

    // Add a source image file to copy into templates
    MockFs.addFiles([sourceImagePath]);
  });

  afterEach(cleanup);

  it('adds the template to the store with a generated ID', async () => {
    const template = await createDatabaseEntryTemplate(
      entryTemplatesDatabase.id,
      {
        name: 'New Template',
        defaultTitle: 'New Entry',
        properties: { Notes: 'Some notes' },
      },
    );

    expect(getDatabaseEntryTemplate(template.id)).toEqual({
      id: expect.stringMatching(/^database-entry-template_/),
      database: entryTemplatesDatabase.id,
      name: 'New Template',
      defaultTitle: 'New Entry',
      properties: { Notes: 'Some notes' },
      created: mockDate,
      lastModified: mockDate,
    });
  });

  it('writes the template config file', async () => {
    const template = await createDatabaseEntryTemplate(
      entryTemplatesDatabase.id,
      {
        name: 'New Template',
        properties: { Notes: 'Some notes' },
      },
    );

    // The config file should contain the template without the
    // database ID.
    expect(
      MockFs.readJsonFile(
        resolveEntryTemplateConfigFilePath(
          databaseDirPath(entryTemplatesDatabase),
          template.id,
        ),
      ),
    ).toEqual({
      id: template.id,
      name: 'New Template',
      properties: { Notes: 'Some notes' },
      created: mockDate,
      lastModified: mockDate,
    });
  });

  it("appends the template to the config's template ID list", async () => {
    const template = await createDatabaseEntryTemplate(
      entryTemplatesDatabase.id,
      {
        name: 'New Template',
        properties: {},
      },
    );

    expect(getDatabase(entryTemplatesDatabase.id).entryTemplates).toEqual([
      ...entryTemplatesDatabase.entryTemplates,
      template.id,
    ]);
  });

  it('rejects file based property values set without a file', async () => {
    await expect(
      createDatabaseEntryTemplate(entryTemplatesDatabase.id, {
        name: 'New Template',
        properties: { Image: 'some-image.png' },
      }),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('prunes empty property values', async () => {
    const template = await createDatabaseEntryTemplate(
      entryTemplatesDatabase.id,
      {
        name: 'New Template',
        properties: {
          Notes: '',
          Status: [],
          Due: null,
          Urgent: false,
          Count: 0,
        },
      },
    );

    // Empty values should be dropped, false and 0 kept
    expect(template.properties).toEqual({ Urgent: false, Count: 0 });
  });

  it('copies provided files into the template directory', async () => {
    const template = await createDatabaseEntryTemplate(
      entryTemplatesDatabase.id,
      { name: 'New Template', properties: {} },
      { Image: sourceImagePath },
    );

    // The file name should be stored as the property value
    expect(template.properties.Image).toBe('source-image.png');
    // The file should exist in the template's directory
    expect(
      MockFs.exists(
        resolveEntryTemplateFilePath(
          databaseDirPath(entryTemplatesDatabase),
          template.id,
          'source-image.png',
        ),
      ),
    ).toBeTruthy();
  });

  it('dispatches an entry template added event', async () =>
    new Promise<void>((done) => {
      Events.addListener(
        DatabaseEntryTemplateCreatedEvent,
        'test',
        (payload) => {
          // Payload data should be the new template
          expect(payload.database).toBe(entryTemplatesDatabase.id);
          expect(payload.name).toBe('New Template');
          done();
        },
      );

      createDatabaseEntryTemplate(entryTemplatesDatabase.id, {
        name: 'New Template',
        properties: {},
      });
    }));
});
