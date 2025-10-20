import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PropertySchema, PropertyType } from '@minddrop/properties';
import { ItemTypeConfigsStore } from '../ItemTypeConfigsStore';
import { cleanup, markdownItemTypeConfig, setup } from '../test-utils';
import { ItemTypeConfig } from '../types';
import { addItemTypeProperty } from './addItemTypeProperty';

const newProperty: PropertySchema = {
  name: 'New Property',
  type: PropertyType.Text,
};

const updatedItemType: ItemTypeConfig = {
  ...markdownItemTypeConfig,
  properties: [...markdownItemTypeConfig.properties, newProperty],
};

describe('addPropertyToItemType', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('adds the property to the item type', async () => {
    const result = await addItemTypeProperty(
      markdownItemTypeConfig.type,
      newProperty,
    );

    expect(result).toEqual(updatedItemType);
  });

  it('updates the item type', async () => {
    await addItemTypeProperty(markdownItemTypeConfig.type, newProperty);

    expect(ItemTypeConfigsStore.get(markdownItemTypeConfig.type)).toEqual(
      updatedItemType,
    );
  });
});
