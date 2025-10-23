import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Fs } from '@minddrop/file-system';
import { ItemTypes, ItemTypesFixtures } from '@minddrop/item-types';
import { AssetsDirPath } from '../constants';
import { MockFs, cleanup, markdownItem1, setup } from '../test-utils';
import { ensureItemAssetsDirExists } from './ensureItemAssetsDirExists';

const itemTypeAssetsDirPath = Fs.concatPath(
  ItemTypes.dirPath(ItemTypesFixtures.markdownItemTypeConfig),
  AssetsDirPath,
);

describe('ensureItemAssetsDirExists', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('creates the item type assets directory if it does not exist', async () => {
    await ensureItemAssetsDirExists(markdownItem1.path);

    expect(MockFs.exists(itemTypeAssetsDirPath)).toBe(true);
  });

  it("creates the item's assets directory if it does not exist", async () => {
    await ensureItemAssetsDirExists(markdownItem1.path);

    const path = Fs.concatPath(itemTypeAssetsDirPath, markdownItem1.title);

    expect(MockFs.exists(path)).toBe(true);
  });
});
