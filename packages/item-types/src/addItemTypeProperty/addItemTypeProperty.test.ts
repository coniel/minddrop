import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PropertySchema } from '@minddrop/properties';
import { ItemTypeConfigsStore } from '../ItemTypeConfigsStore';
import { cleanup, markdownItemTypeConfig, setup } from '../test-utils';
import { ItemTypeConfig } from '../types';
import { addItemTypeProperty } from './addItemTypeProperty';

const newProperty: PropertySchema = {
  name: 'New Property',
  type: 'text',
};

const updatedItemType: ItemTypeConfig = {
  ...markdownItemTypeConfig,
  properties: [...markdownItemTypeConfig.properties, newProperty],
};

describe('addItemTypeProperty', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('adds the property to the item type', async () => {
    const result = await addItemTypeProperty(
      markdownItemTypeConfig.nameSingular,
      newProperty,
    );

    expect(result).toEqual(updatedItemType);
  });

  it('updates the item type', async () => {
    await addItemTypeProperty(markdownItemTypeConfig.nameSingular, newProperty);

    expect(
      ItemTypeConfigsStore.get(markdownItemTypeConfig.nameSingular),
    ).toEqual(updatedItemType);
  });
});
