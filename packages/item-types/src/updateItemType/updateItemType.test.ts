import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { BaseDirectory } from '@minddrop/file-system';
import { ItemTypeConfigsStore } from '../ItemTypeConfigsStore';
import { ItemTypeConfigsDir } from '../constants';
import { MockFs, cleanup, markdownItemTypeConfig, setup } from '../test-utils';
import { itemTypeConfigFilePath } from '../utils';
import { UpdateItemTypeData, updateItemType } from './updateItemType';

const update: UpdateItemTypeData = {
  description: 'An updated description',
};

const updatedConfig = {
  ...markdownItemTypeConfig,
  ...update,
};

describe('updateItemType', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('should update an item type', async () => {
    const result = await updateItemType(
      markdownItemTypeConfig.nameSingular,
      update,
    );

    expect(result).toEqual(updatedConfig);
  });

  it('updates the item type config in the store', async () => {
    await updateItemType(markdownItemTypeConfig.nameSingular, update);

    expect(
      ItemTypeConfigsStore.get(markdownItemTypeConfig.nameSingular),
    ).toEqual(updatedConfig);
  });

  it('writes the updated config to the file system', async () => {
    await updateItemType(markdownItemTypeConfig.nameSingular, update);

    const result = MockFs.readJsonFile(itemTypeConfigFilePath(updatedConfig));

    expect(result).toEqual(updatedConfig);
  });

  it('dispatches a item type update event', async () =>
    new Promise<void>((done) => {
      Events.addListener('item-types:item-type:update', 'test', (payload) => {
        // Payload data should be the updated item type config
        expect(payload.data).toEqual(updatedConfig);
        done();
      });

      updateItemType(markdownItemTypeConfig.nameSingular, update);
    }));
});
