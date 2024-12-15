import { beforeAll, describe, expect, it } from 'vitest';
import { registerAssetHandler } from '../AssetHandlersStore';
import { AssetHandler } from '../types';
import { getAssetPath } from './getAssetPath';

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

describe('getAssetPath', () => {
  beforeAll(() => {
    registerAssetHandler(handler);
  });

  it('returns the asset path, including filename', () => {
    expect(getAssetPath(RESOURCE_ID, 'image.jpg')).toBe(
      `${ASSETS_PATH}/${RESOURCE_ID}/image.jpg`,
    );
  });

  it('returns null if no asset path was found', () => {
    expect(getAssetPath('foo', 'image.jpg')).toBe(null);
  });

  it('returns null if no asset filename is null', () => {
    expect(getAssetPath(RESOURCE_ID, null)).toBe(null);
  });
});
