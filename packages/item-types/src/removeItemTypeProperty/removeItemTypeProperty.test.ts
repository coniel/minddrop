import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ItemTypeConfigsStore } from '../ItemTypeConfigsStore';
import { cleanup, markdownItemTypeConfig, setup } from '../test-utils';
import { removeItemTypeProperty } from './removeItemTypeProperty';

const propertyNameToRemove = markdownItemTypeConfig.properties[0].name;

const updatedItemType = {
  ...markdownItemTypeConfig,
  properties: markdownItemTypeConfig.properties.slice(1),
};

describe('removePropertyFromItemType', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes the property from the item type', async () => {
    const result = await removeItemTypeProperty(
      markdownItemTypeConfig.type,
      propertyNameToRemove,
    );

    expect(result).toEqual(updatedItemType);
  });

  it('updates the item type', async () => {
    await removeItemTypeProperty(
      markdownItemTypeConfig.type,
      propertyNameToRemove,
    );

    expect(ItemTypeConfigsStore.get(markdownItemTypeConfig.type)).toEqual(
      updatedItemType,
    );
  });
});
