import { beforeAll, describe, expect, it } from 'vitest';
import { registerAssetHandler } from '../AssetHandlersStore';
import { AssetHandler } from '../types';
import { getAssetHandler } from './getAssetHandler';

const ASSETS_PATH = 'assets';
const RESOURCE_ID = 'resource-id';

const handler: AssetHandler = {
  id: 'test-handler',
  getResourceAssetsPath: (id) =>
    id === RESOURCE_ID ? `${ASSETS_PATH}/${id}` : false,
  ensureResourceAssetsPath: async (id) => {
    return `${ASSETS_PATH}/${id}`;
  },
};

describe('getAssetHandler', () => {
  beforeAll(() => {
    registerAssetHandler(handler);
  });

  it('returns the asset handler when a match is found', () => {
    expect(getAssetHandler(RESOURCE_ID)).toBe(handler);
  });

  it('returns null when no match is found', () => {
    expect(getAssetHandler('foo')).toBe(null);
  });
});
