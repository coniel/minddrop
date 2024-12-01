import { describe, afterEach, it, expect, beforeAll, afterAll } from 'vitest';
import { downloadAsset } from './downloadAsset';
import { AssetResourceNotMatchedError } from '../errors';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { AssetHandler } from '../types';
import {
  registerAssetHandler,
  unregisterAssetHandler,
} from '../AssetHandlersStore';

const MockFs = initializeMockFileSystem(['assets']);

const RESOURCE_ID = 'resource-id';
const ASSETS_PATH = `assets/${RESOURCE_ID}`;
const ASSET_FILENAME = 'image.jpg';
const ASSET_URL = 'https://example.com/image.jpg';

const handler: AssetHandler = {
  id: 'test-handler',
  getResourceAssetsPath: (id) => (id === RESOURCE_ID ? ASSETS_PATH : false),
  ensureResourceAssetsPath: async (id) => {
    if (id !== RESOURCE_ID) {
      return false;
    }

    MockFs.addFiles([ASSETS_PATH]);

    return ASSETS_PATH;
  },
};

describe('downloadAsset', () => {
  beforeAll(() => {
    registerAssetHandler(handler);
  });

  afterEach(() => {
    MockFs.reset();
  });

  afterAll(() => {
    unregisterAssetHandler(handler.id);
  });

  it('throws if no handler matches the resource', () => {
    expect(downloadAsset('foo', ASSET_FILENAME, ASSET_URL)).rejects.toThrow(
      AssetResourceNotMatchedError,
    );
  });

  it('ensures the asset directory exists', async () => {
    await downloadAsset(RESOURCE_ID, ASSET_FILENAME, ASSET_URL);

    expect(MockFs.exists(ASSETS_PATH)).toBe(true);
  });

  it('downloads the asset to the resource assets directory', async () => {
    await downloadAsset(RESOURCE_ID, ASSET_FILENAME, ASSET_URL);

    expect(MockFs.exists(`${ASSETS_PATH}/${ASSET_FILENAME}`)).toBe(true);
  });

  it('returns the path to the downloaded asset', async () => {
    const assetPath = await downloadAsset(
      RESOURCE_ID,
      ASSET_FILENAME,
      ASSET_URL,
    );

    expect(assetPath).toBe(`${ASSETS_PATH}/${ASSET_FILENAME}`);
  });
});
