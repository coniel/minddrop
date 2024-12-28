import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { registerAssetHandler } from '../AssetHandlersStore';
import { cleanup } from '../test-utils';
import { AssetHandler } from '../types';
import { resourceHasAssets } from './resourceHasAssets';

const ASSETS_PATH = 'assets';
const RESOURCE_ID = 'resource-id';
const NO_ASSETS_RESOURCE_ID = 'no-assets-resource-id';

const handler: AssetHandler = {
  id: 'test-handler',
  getResourceAssetsPath: (id) =>
    [RESOURCE_ID, NO_ASSETS_RESOURCE_ID].includes(id)
      ? `${ASSETS_PATH}/${id}`
      : false,
  ensureResourceAssetsPath: async (id) => {
    return `${ASSETS_PATH}/${id}`;
  },
};

initializeMockFileSystem([`${ASSETS_PATH}/${RESOURCE_ID}/asset-1.png`]);

describe('resourceHasAssets', () => {
  beforeEach(() => {
    registerAssetHandler(handler);
  });

  afterEach(cleanup);

  it('returns true if the resource has assets', async () => {
    const result = await resourceHasAssets(RESOURCE_ID);

    expect(result).toBe(true);
  });

  it('returns false if the resource does not have assets', async () => {
    const result = await resourceHasAssets(NO_ASSETS_RESOURCE_ID);

    expect(result).toBe(false);
  });

  it('returns false if the resource was not matched by an asset handler', async () => {
    const result = await resourceHasAssets('unknown-resource-id');

    expect(result).toBe(false);
  });
});
