import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  MockFs,
  cleanup,
  databaseDirPath,
  entryTemplate1,
  entryTemplatesDatabase,
  setup,
} from '../test-utils';
import { resolveEntryTemplateConfigFilePath } from '../utils';
import { readDatabaseEntryTemplate } from './readDatabaseEntryTemplate';

// Path to the template's config file
const configPath = resolveEntryTemplateConfigFilePath(
  databaseDirPath(entryTemplatesDatabase),
  entryTemplate1.id,
);

describe('readDatabaseEntryTemplate', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("reads the template with its database's ID attached", async () => {
    expect(
      await readDatabaseEntryTemplate(configPath, entryTemplatesDatabase.id),
    ).toEqual({ status: 'read', value: entryTemplate1 });
  });

  it('reports a config file which cannot be parsed as unreadable', async () => {
    MockFs.writeTextFile(configPath, 'not json');

    expect(
      await readDatabaseEntryTemplate(configPath, entryTemplatesDatabase.id),
    ).toEqual({ status: 'unreadable' });
  });

  it.each(['{}', 'null'])(
    'reports a config file holding %s as unreadable',
    async (textContent) => {
      MockFs.writeTextFile(configPath, textContent);

      expect(
        await readDatabaseEntryTemplate(configPath, entryTemplatesDatabase.id),
      ).toEqual({ status: 'unreadable' });
    },
  );

  it('reports a missing config file as missing', async () => {
    MockFs.removeFile(configPath);

    expect(
      await readDatabaseEntryTemplate(configPath, entryTemplatesDatabase.id),
    ).toEqual({ status: 'missing' });
  });
});
