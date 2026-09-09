import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  MockFs,
  cleanup,
  databaseDirPath,
  entryTemplate2,
  entryTemplatesDatabase,
  parentDir,
  setup,
} from '../test-utils';
import { resolveEntryTemplateFilePath } from '../utils';
import { copyEntryTemplateFiles } from './copyEntryTemplateFiles';

const sourceImagePath = `${parentDir}/source-image.png`;

describe('copyEntryTemplateFiles', () => {
  beforeEach(() => {
    setup();

    // Add a source image file to copy into templates
    MockFs.addFiles([sourceImagePath]);
  });

  afterEach(cleanup);

  it("copies the files into the template's directory", async () => {
    await copyEntryTemplateFiles(
      databaseDirPath(entryTemplatesDatabase),
      entryTemplate2.id,
      { Image: sourceImagePath },
    );

    expect(
      MockFs.exists(
        resolveEntryTemplateFilePath(
          databaseDirPath(entryTemplatesDatabase),
          entryTemplate2.id,
          'source-image.png',
        ),
      ),
    ).toBe(true);
  });

  it('returns the stored file names keyed by property name', async () => {
    const storedFileNames = await copyEntryTemplateFiles(
      databaseDirPath(entryTemplatesDatabase),
      entryTemplate2.id,
      { Image: sourceImagePath },
    );

    expect(storedFileNames).toEqual({ Image: 'source-image.png' });
  });

  it('increments the file name when a stored file has the same name', async () => {
    // Add a stored file with the source file's name
    MockFs.addFiles([
      resolveEntryTemplateFilePath(
        databaseDirPath(entryTemplatesDatabase),
        entryTemplate2.id,
        'source-image.png',
      ),
    ]);

    const storedFileNames = await copyEntryTemplateFiles(
      databaseDirPath(entryTemplatesDatabase),
      entryTemplate2.id,
      { Image: sourceImagePath },
    );

    // The copy should be stored under an incremented name
    expect(storedFileNames).toEqual({ Image: 'source-image 1.png' });
    expect(
      MockFs.exists(
        resolveEntryTemplateFilePath(
          databaseDirPath(entryTemplatesDatabase),
          entryTemplate2.id,
          'source-image 1.png',
        ),
      ),
    ).toBe(true);
  });

  it('does nothing without files', async () => {
    expect(
      await copyEntryTemplateFiles(
        databaseDirPath(entryTemplatesDatabase),
        entryTemplate2.id,
        {},
      ),
    ).toEqual({});
  });
});
