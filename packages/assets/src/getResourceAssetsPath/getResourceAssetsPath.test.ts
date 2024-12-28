import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { registerAssetHandler } from '../AssetHandlersStore';
import { cleanup } from '../test-utils';
import { AssetHandler } from '../types';
import { getResourceAssetsPath } from './getResourceAssetsPath';

const ASSETS_PATH = 'assets';
const RESOURCE_ID = 'resource-id';
const RESOUCE_ASSETS_PATH = `${ASSETS_PATH}/${RESOURCE_ID}`;

const handler: AssetHandler = {
  id: 'test-handler',
  getResourceAssetsPath: (id) =>
    id === RESOURCE_ID ? RESOUCE_ASSETS_PATH : false,
  ensureResourceAssetsPath: async () => {
    return RESOUCE_ASSETS_PATH;
  },
};

describe('getResourceAssetsPath', () => {
  beforeEach(() => {
    registerAssetHandler(handler);
  });

  afterEach(cleanup);

  it('returns the resource assets path', async () => {
    expect(getResourceAssetsPath(RESOURCE_ID)).toBe(RESOUCE_ASSETS_PATH);
  });

  it('returns null if the resouce was not matched by any handlers', () => {
    expect(getResourceAssetsPath('foo')).toBe(null);
  });
});
