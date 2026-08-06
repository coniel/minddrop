import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Fs } from '@minddrop/file-system';
import { DatabaseEntryNotFoundError } from '../errors';
import {
  MockFs,
  cleanup,
  imagePropertyName,
  rootStorageDatabase,
  rootStorageEntry1,
  setup,
} from '../test-utils';
import { downloadPropertyFile } from './downloadPropertyFile';

const url = 'https://example.com/image.png';
// The file name derived from the URL's title and extension
const fileName = 'example.com_image.png';

describe('downloadPropertyFile', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the entry does not exist', async () => {
    await expect(() =>
      downloadPropertyFile('missing-entry', imagePropertyName, url),
    ).rejects.toThrowError(DatabaseEntryNotFoundError);
  });

  it("downloads the file to the property's file path", async () => {
    await downloadPropertyFile(rootStorageEntry1.id, imagePropertyName, url);

    expect(
      MockFs.exists(Fs.concatPath(rootStorageDatabase.path, fileName)),
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
    MockFs.addFiles([Fs.concatPath(rootStorageDatabase.path, fileName)]);

    await downloadPropertyFile(rootStorageEntry1.id, imagePropertyName, url);

    expect(
      MockFs.exists(
        Fs.concatPath(rootStorageDatabase.path, 'example.com_image 1.png'),
      ),
    ).toBe(true);
  });

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
