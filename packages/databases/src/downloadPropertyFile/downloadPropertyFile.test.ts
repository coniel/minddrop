import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Fs } from '@minddrop/file-system';
import { EntryNotFoundError } from '../errors';
import {
  MockFs,
  cleanup,
  databaseDirPath,
  imagePropertyName,
  rootStorageDatabase,
  rootStorageEntry1,
  setup,
} from '../test-utils';
import { downloadPropertyFile } from './downloadPropertyFile';

const url = 'https://example.com/image.png';
// The file name derived from the URL's title and extension
const fileNameBase = 'example.com_image';
const fileName = `${fileNameBase}.png`;
// The file name incremented past an existing file of the same name
const incrementedFileName = `${fileNameBase} 1.png`;

describe('downloadPropertyFile', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the entry does not exist', async () => {
    await expect(() =>
      downloadPropertyFile('missing-entry', imagePropertyName, url),
    ).rejects.toThrowError(EntryNotFoundError);
  });

  it("downloads the file to the property's file path", async () => {
    await downloadPropertyFile(rootStorageEntry1.id, imagePropertyName, url);

    expect(
      MockFs.exists(
        Fs.concatPath(databaseDirPath(rootStorageDatabase), fileName),
      ),
    ).toBe(true);
  });

  it('returns the file name derived from the URL', async () => {
    const result = await downloadPropertyFile(
      rootStorageEntry1.id,
      imagePropertyName,
      url,
    );

    expect(result).toBe(fileName);
  });

  it('increments the file name if the file already exists', async () => {
    // Add a file which collides with the downloaded file's name
    MockFs.addFiles([
      Fs.concatPath(databaseDirPath(rootStorageDatabase), fileName),
    ]);

    await downloadPropertyFile(rootStorageEntry1.id, imagePropertyName, url);

    expect(
      MockFs.exists(
        Fs.concatPath(
          databaseDirPath(rootStorageDatabase),
          incrementedFileName,
        ),
      ),
    ).toBe(true);
  });

  // Pins Issue 47: downloadPropertyFile returns the un-incremented file name.
  // Remove .fails once fixed.
  it.fails(
    'returns the incremented file name when the file already exists',
    async () => {
      // Add a file which collides with the downloaded file's name
      MockFs.addFiles([
        Fs.concatPath(databaseDirPath(rootStorageDatabase), fileName),
      ]);

      const result = await downloadPropertyFile(
        rootStorageEntry1.id,
        imagePropertyName,
        url,
      );

      expect(result).toBe(incrementedFileName);
    },
  );

  it('returns false if the download fails', async () => {
    const originalDownloadFile = Fs.downloadFile;

    Fs.downloadFile = vi.fn().mockRejectedValue(new Error('Download failed'));

    const result = await downloadPropertyFile(
      rootStorageEntry1.id,
      imagePropertyName,
      url,
    );

    expect(result).toBe(false);

    // Restore the original function
    Fs.downloadFile = originalDownloadFile;
  });
});
