import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  BaseItemTypeNotFoundError,
  BaseItemTypesFixtures,
} from '@minddrop/base-item-types';
import { Events } from '@minddrop/events';
import { PathConflictError } from '@minddrop/file-system';
import { InvalidParameterError } from '@minddrop/utils';
import { ItemTypeConfigsStore } from '../ItemTypeConfigsStore';
import { MockFs, cleanup, setup } from '../test-utils';
import { ItemTypeConfig } from '../types';
import { itemTypeConfigFilePath, itemsDirPath } from '../utils';
import { CreateItemTypeOptions, createItemType } from './createItemType';

const baseItemType = BaseItemTypesFixtures.urlBaseItemType;

const options: CreateItemTypeOptions = {
  nameSingular: 'Test',
  nameSingular: 'Tests',
  description: 'A test item type for unit testing',
  icon: 'test-icon',
  color: 'red',
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

  it('throws if the base item type does not exist', async () => {
    const invalidOptions = {
      ...options,
      baseType: 'non-existent-base-type',
    };

    await expect(createItemType(invalidOptions)).rejects.toThrow(
      BaseItemTypeNotFoundError,
    );
  });

  it('throws if the item type already exists', async () => {
    // First, create the item type
    await createItemType(options);

    // Then, try to create it again
    await expect(createItemType(options)).rejects.toThrow(
      InvalidParameterError,
    );
  });

  it('throws if the item type directory already exists', async () => {
    // First, create the item type directory
    MockFs.createDir(itemsDirPath(options));

    // Then, try to create an item with the same directory path
    await expect(createItemType(options)).rejects.toThrow(PathConflictError);
  });

  it('creates a new item type with the given options', async () => {
    const itemType = await createItemType(options);

    expect(itemType).toMatchObject(newItemType);
  });

  it('adds the config to the item types store', async () => {
    const itemType = await createItemType(options);

    expect(ItemTypeConfigsStore.get(itemType.nameSingular)).toEqual(itemType);
  });

  it('writes the config to the file system', async () => {
    const path = itemTypeConfigFilePath(options);

    const itemType = await createItemType(options);

    expect(MockFs.readJsonFile(path)).toEqual(itemType);
  });

  it('creates the item type directory in the workspace', async () => {
    await createItemType(options);

    expect(MockFs.exists(itemsDirPath(options))).toBe(true);
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
