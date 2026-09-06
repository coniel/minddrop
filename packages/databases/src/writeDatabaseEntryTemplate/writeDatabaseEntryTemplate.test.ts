import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseEntryTemplateNotFoundError } from '../errors';
import {
  MockFs,
  cleanup,
  entryTemplate1,
  entryTemplatesDatabase,
  setup,
} from '../test-utils';
import {
  resolveEntryTemplateConfigFilePath,
  resolveEntryTemplateDirPath,
} from '../utils';
import { writeDatabaseEntryTemplate } from './writeDatabaseEntryTemplate';

// Path to entryTemplate1's config file
const configPath = resolveEntryTemplateConfigFilePath(
  entryTemplatesDatabase.path,
  entryTemplate1.id,
);

// The template as stored in its config file (the database ID is
// not persisted).
const { database: _database, ...storedTemplate } = entryTemplate1;

describe('writeDatabaseEntryTemplate', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the template does not exist', async () => {
    await expect(writeDatabaseEntryTemplate('missing')).rejects.toThrow(
      DatabaseEntryTemplateNotFoundError,
    );
  });

  it('writes the template config to the file system', async () => {
    // Remove the existing config file from the mock file system
    MockFs.removeFile(configPath);

    await writeDatabaseEntryTemplate(entryTemplate1.id);

    expect(MockFs.readJsonFile(configPath)).toEqual(storedTemplate);
  });

  it("creates the template's directory if it does not exist", async () => {
    // Remove the template's directory
    MockFs.removeDir(
      resolveEntryTemplateDirPath(
        entryTemplatesDatabase.path,
        entryTemplate1.id,
      ),
    );

    await writeDatabaseEntryTemplate(entryTemplate1.id);

    expect(MockFs.exists(configPath)).toBe(true);
  });
});
