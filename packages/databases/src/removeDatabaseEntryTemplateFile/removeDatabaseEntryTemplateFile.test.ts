import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseFixtures, MockFs, cleanup, setup } from '../test-utils';
import { resolveEntryTemplateFilePath } from '../utils';
import { removeDatabaseEntryTemplateFile } from './removeDatabaseEntryTemplateFile';

const {
  databaseDirPath,
  entryTemplate1,
  entryTemplatesDatabase,
  imagePropertyName,
} = DatabaseFixtures;

// The image file stored for the template
const fileName = entryTemplate1.properties[imagePropertyName] as string;

// Path to the stored image file
const filePath = resolveEntryTemplateFilePath(
  databaseDirPath(entryTemplatesDatabase),
  entryTemplate1.id,
  fileName,
);

describe('removeDatabaseEntryTemplateFile', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('deletes the file', async () => {
    // Remove the stored file
    await removeDatabaseEntryTemplateFile(
      databaseDirPath(entryTemplatesDatabase),
      entryTemplate1.id,
      fileName,
    );

    // The file should no longer exist
    expect(MockFs.exists(filePath)).toBe(false);
  });

  it('does nothing when the file does not exist', async () => {
    // Delete the file beforehand
    MockFs.removeFile(filePath);

    // Should not throw
    await expect(
      removeDatabaseEntryTemplateFile(
        databaseDirPath(entryTemplatesDatabase),
        entryTemplate1.id,
        fileName,
      ),
    ).resolves.toBeUndefined();
  });
});
