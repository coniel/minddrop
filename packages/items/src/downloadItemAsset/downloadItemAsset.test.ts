import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Fs } from '@minddrop/file-system';
import { ItemTypesFixtures } from '@minddrop/item-types';
import { ItemTypes } from '@minddrop/item-types';
import { AssetsDirPath } from '../constants';
import { MockFs, cleanup, markdownItem1, setup } from '../test-utils';
import { downloadItemAsset } from './downloadItemAsset';

// Item type's assets directory path
const itemTypeAssetsDirPath = Fs.concatPath(
  ItemTypes.dirPath(ItemTypesFixtures.markdownItemTypeConfig),
  AssetsDirPath,
);
// Item's assets directory path
const itemAssetsDirPath = Fs.concatPath(
  itemTypeAssetsDirPath,
  markdownItem1.title,
);
const url = 'https://example.com/image.png';
const fileName = 'foo.png';

describe('downloadItemAsset', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('creates the assets directory if it does not exist', async () => {
    await downloadItemAsset(markdownItem1.path, url, 'foo');

    expect(MockFs.exists(itemTypeAssetsDirPath)).toBe(true);
  });

  it("creates the item's assets directory if it does not exist", async () => {
    await downloadItemAsset(markdownItem1.path, url, 'foo');

    expect(MockFs.exists(itemAssetsDirPath)).toBe(true);
  });

  it('downloads the asset to the item assets directory', async () => {
    const assetPath = Fs.concatPath(itemAssetsDirPath, fileName);

    await downloadItemAsset(markdownItem1.path, url, 'foo');

    expect(MockFs.exists(assetPath)).toBe(true);
  });

  it('replaces existing assets with the same name', async () => {
    const assetPath = Fs.concatPath(itemAssetsDirPath, fileName);

    // Add a mock file to simulate an existing asset
    MockFs.addFiles([assetPath]);

    // Shouldn't throw an error
    await expect(
      downloadItemAsset(markdownItem1.path, url, 'foo'),
    ).resolves.not.toThrow();
  });

  it('returns asset file name upon successful download', async () => {
    const result = await downloadItemAsset(markdownItem1.path, url, 'foo');

    expect(result).toBe(fileName);
  });

  it('returns false if the download fails', async () => {
    // Mock Fs.downloadFile to throw an error
    const originalDownloadFile = Fs.downloadFile;
    Fs.downloadFile = vi.fn().mockRejectedValue(new Error('Download failed'));

    const result = await downloadItemAsset(markdownItem1.path, url, 'foo');

    expect(result).toBe(false);

    // Restore the original function
    Fs.downloadFile = originalDownloadFile;
  });
});
