import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { BaseItemTypesFixtures } from '@minddrop/base-item-types';
import { Events } from '@minddrop/events';
import { BaseDirectory } from '@minddrop/file-system';
import { ItemTypeConfigsStore } from '../ItemTypeConfigsStore';
import { ItemTypeConfigsDir } from '../constants';
import { MockFs, cleanup, setup } from '../test-utils';
import { ItemTypeConfig } from '../types';
import { CreateItemTypeOptions, createItemType } from './createItemType';

const baseItemType = BaseItemTypesFixtures.urlBaseItemType;

const options: CreateItemTypeOptions = {
  name: 'Test Item Type',
  description: 'A test item type for unit testing',
  icon: 'test-icon',
  type: 'test-type',
  baseType: baseItemType.type,
};

const newItemType: ItemTypeConfig = {
  ...options,
  // Should inherit properties from the base item type
  properties: baseItemType.properties,
};

describe('createItemType', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('creates a new item type with the given options', async () => {
    const itemType = await createItemType(options);

    expect(itemType).toMatchObject(newItemType);
  });

  it('adds the config to the item types store', async () => {
    const itemType = await createItemType(options);

    expect(ItemTypeConfigsStore.get(itemType.type)).toEqual(itemType);
  });

  it('writes the config to the file system', async () => {
    const path = `${ItemTypeConfigsDir}/${options.type}.json`;

    const itemType = await createItemType(options);

    expect(
      MockFs.readJsonFile(path, { baseDir: BaseDirectory.WorkspaceConfig }),
    ).toEqual(itemType);
  });

  it('dispatches a item type create event', async () =>
    new Promise<void>((done) => {
      Events.addListener('item-types:item-type:create', 'test', (payload) => {
        // Payload data should be the item type config
        expect(payload.data).toEqual(newItemType);
        done();
      });

      createItemType(options);
    }));
});
