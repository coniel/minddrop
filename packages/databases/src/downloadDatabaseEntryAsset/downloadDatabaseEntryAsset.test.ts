import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { AssetsDirName } from '../constants';
import {
  MockFs,
  cleanup,
  objectDatabase,
  objectEntry1,
  setup,
} from '../test-utils';
import { downloadDatabaseEntryAsset } from './downloadDatabaseEntryAsset';

// 'assets' directory path
const entryTypeAssetsDirPath = Fs.concatPath(
  objectDatabase.path,
  Paths.hiddenDirName,
  AssetsDirName,
);
// Entry's assets directory path
const entryAssetsDirPath = Fs.concatPath(
  entryTypeAssetsDirPath,
  objectEntry1.title,
);
const url = 'https://example.com/image.png';
const fileName = 'foo.png';

describe('downloadDatabaseEntryAsset', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('creates the assets directory if it does not exist', async () => {
    await downloadDatabaseEntryAsset(objectEntry1.id, url, 'foo');

    expect(MockFs.exists(entryTypeAssetsDirPath)).toBe(true);
  });

  it("creates the entry's assets directory if it does not exist", async () => {
    await downloadDatabaseEntryAsset(objectEntry1.id, url, 'foo');

    expect(MockFs.exists(entryAssetsDirPath)).toBe(true);
  });

  it('downloads the asset to the entry assets directory', async () => {
    const assetPath = Fs.concatPath(entryAssetsDirPath, fileName);

    await downloadDatabaseEntryAsset(objectEntry1.id, url, 'foo');

    expect(MockFs.exists(assetPath)).toBe(true);
  });

  it('replaces existing assets with the same name', async () => {
    const assetPath = Fs.concatPath(entryAssetsDirPath, fileName);

    // Add a mock file to simulate an existing asset
    MockFs.addFiles([assetPath]);

    // Shouldn't throw an error
    await expect(
      downloadDatabaseEntryAsset(objectEntry1.id, url, 'foo'),
    ).resolves.not.toThrow();
  });

  it('returns asset file name upon successful download', async () => {
    const result = await downloadDatabaseEntryAsset(
      objectEntry1.id,
      url,
      'foo',
    );

    expect(result).toBe(fileName);
  });

  it('returns false if the download fails', async () => {
    // Mock Fs.downloadFile to throw an error
    const originalDownloadFile = Fs.downloadFile;
    Fs.downloadFile = vi.fn().mockRejectedValue(new Error('Download failed'));

    const result = await downloadDatabaseEntryAsset(
      objectEntry1.id,
      url,
      'foo',
    );

    expect(result).toBe(false);

    // Restore the original function
    Fs.downloadFile = originalDownloadFile;
  });
});
