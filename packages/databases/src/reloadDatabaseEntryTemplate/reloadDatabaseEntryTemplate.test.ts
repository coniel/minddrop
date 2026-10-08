import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { storeItem } from '@minddrop/stores/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DatabaseEntryTemplatesStore } from '../DatabaseEntryTemplatesStore';
import { DatabasesStore } from '../DatabasesStore';
import {
  MockFs,
  cleanup,
  databaseDirPath,
  entryTemplate1,
  entryTemplate2,
  entryTemplatesDatabase,
  objectDatabase,
  setup,
} from '../test-utils';
import { DatabaseEntryTemplate } from '../types';
import {
  resolveEntryTemplateConfigFilePath,
  resolveEntryTemplateDirPath,
  serializeDatabaseEntryTemplate,
} from '../utils';
import { reloadDatabaseEntryTemplate } from './reloadDatabaseEntryTemplate';

const { workspace_1 } = WorkspaceFixtures;

const databasePath = databaseDirPath(entryTemplatesDatabase);
const templatePath = resolveEntryTemplateConfigFilePath(
  databasePath,
  entryTemplate1.id,
);

describe('reloadDatabaseEntryTemplate', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("loads a new template into the store and the database's template list", async () => {
    // Add a new template's config file
    const created: DatabaseEntryTemplate = {
      ...entryTemplate2,
      id: 'database-entry-template_9',
    };
    MockFs.addFiles([
      {
        path: resolveEntryTemplateConfigFilePath(databasePath, created.id),
        textContent: JSON.stringify(serializeDatabaseEntryTemplate(created)),
      },
    ]);

    await reloadDatabaseEntryTemplate(
      entryTemplatesDatabase,
      created.id,
      workspace_1,
    );

    expect(DatabaseEntryTemplatesStore).toHaveItem(created.id, created);
    expect(
      storeItem(DatabasesStore, entryTemplatesDatabase.id).entryTemplates,
    ).toEqual([entryTemplate1.id, entryTemplate2.id, created.id]);
  });

  it("leaves other databases' templates out of the database's template list", async () => {
    // Load a template belonging to another database
    DatabaseEntryTemplatesStore.set({
      ...entryTemplate2,
      id: 'database-entry-template_9',
      database: objectDatabase.id,
    });

    await reloadDatabaseEntryTemplate(
      entryTemplatesDatabase,
      entryTemplate1.id,
      workspace_1,
    );

    expect(
      storeItem(DatabasesStore, entryTemplatesDatabase.id).entryTemplates,
    ).toEqual([entryTemplate1.id, entryTemplate2.id]);
  });

  it('updates a loaded template with its config file', async () => {
    // Rename the template on disk
    MockFs.writeTextFile(
      templatePath,
      JSON.stringify({
        ...serializeDatabaseEntryTemplate(entryTemplate1),
        name: 'Renamed',
      }),
    );

    await reloadDatabaseEntryTemplate(
      entryTemplatesDatabase,
      entryTemplate1.id,
      workspace_1,
    );

    expect(storeItem(DatabaseEntryTemplatesStore, entryTemplate1.id).name).toBe(
      'Renamed',
    );
  });

  it("removes a template whose directory is gone from the store and the database's template list", async () => {
    // Delete the template's directory
    MockFs.removeDir(
      resolveEntryTemplateDirPath(databasePath, entryTemplate1.id),
      { recursive: true },
    );

    await reloadDatabaseEntryTemplate(
      entryTemplatesDatabase,
      entryTemplate1.id,
      workspace_1,
    );

    expect(DatabaseEntryTemplatesStore).not.toHaveItem(entryTemplate1.id);
    expect(
      storeItem(DatabasesStore, entryTemplatesDatabase.id).entryTemplates,
    ).toEqual([entryTemplate2.id]);
  });

  it('leaves a loaded template as it is when its config file cannot be parsed', async () => {
    MockFs.writeTextFile(templatePath, 'not json');

    await reloadDatabaseEntryTemplate(
      entryTemplatesDatabase,
      entryTemplate1.id,
      workspace_1,
    );

    expect(DatabaseEntryTemplatesStore).toHaveItem(
      entryTemplate1.id,
      entryTemplate1,
    );
    expect(
      storeItem(DatabasesStore, entryTemplatesDatabase.id).entryTemplates,
    ).toEqual([entryTemplate1.id, entryTemplate2.id]);
  });

  it('leaves a loaded template as it is when its config file is not a valid template', async () => {
    MockFs.writeTextFile(templatePath, '{}');

    await reloadDatabaseEntryTemplate(
      entryTemplatesDatabase,
      entryTemplate1.id,
      workspace_1,
    );

    expect(DatabaseEntryTemplatesStore).toHaveItem(
      entryTemplate1.id,
      entryTemplate1,
    );
    expect(
      storeItem(DatabasesStore, entryTemplatesDatabase.id).entryTemplates,
    ).toEqual([entryTemplate1.id, entryTemplate2.id]);
  });
});
